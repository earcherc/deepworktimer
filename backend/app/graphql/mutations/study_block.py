import strawberry
from sqlmodel import select
from ...models import StudyBlock
from ...database import get_session
from ..schemas.models import StudyBlockType
from ..schemas.inputs import StudyBlockInput


@strawberry.type
class StudyBlockMutations:
    @strawberry.mutation
    def create_study_block(
        self, study_block: StudyBlockInput, info: strawberry.types.Info
    ) -> StudyBlockType:
        user_id = getattr(info.context["request"].state, "user_id", None)
        if user_id is None:
            return None

        session = next(get_session())
        study_block_data = strawberry.asdict(study_block)
        study_block_data["user_id"] = user_id
        db_study_block = StudyBlock(**study_block_data)

        session.add(db_study_block)
        session.commit()
        session.refresh(db_study_block)

        return StudyBlock.from_orm(db_study_block)

    @strawberry.mutation
    def update_study_block(
        self, id: int, study_block: StudyBlockInput
    ) -> StudyBlockType:
        session = next(get_session())
        db_study_block = session.exec(
            select(StudyBlock).where(StudyBlock.id == id)
        ).first()

        study_block_data = strawberry.asdict(study_block)
        if db_study_block:
            for field, value in study_block_data:
                setattr(db_study_block, field, value)
            session.commit()
            session.refresh(db_study_block)
            return StudyBlock.from_orm(db_study_block)

        return None

    @strawberry.mutation
    def delete_study_block(self, id: int) -> bool:
        session = next(get_session())
        db_study_block = session.exec(
            select(StudyBlock).where(StudyBlock.id == id)
        ).first()

        if db_study_block:
            session.delete(db_study_block)
            session.commit()
            return True

        return False
