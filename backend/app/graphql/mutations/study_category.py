import strawberry
from sqlmodel import select
from ...models import StudyCategory
from ...database import get_session
from ..schemas.models import StudyCategoryType
from ..schemas.inputs import StudyCategoryInput


@strawberry.type
class StudyCategoryMutations:
    @strawberry.mutation
    def create_study_category(
        self, study_category: StudyCategoryInput
    ) -> StudyCategoryType:
        session = next(get_session())

        study_category_data = strawberry.asdict(study_category)
        db_study_category = StudyCategory(**study_category_data)

        session.add(db_study_category)
        session.commit()
        session.refresh(db_study_category)

        return StudyCategory.from_orm(db_study_category)

    @strawberry.mutation
    def update_study_category(
        self, id: int, study_category: StudyCategoryInput
    ) -> StudyCategoryType:
        session = next(get_session())
        db_study_category = session.exec(
            select(StudyCategory).where(StudyCategory.id == id)
        ).first()

        study_category_data = strawberry.asdict(study_category)
        if db_study_category:
            for field, value in study_category_data:
                setattr(db_study_category, field, value)
            session.commit()
            session.refresh(db_study_category)
            return StudyCategory.from_orm(db_study_category)

        return None

    @strawberry.mutation
    def delete_study_category(self, id: int) -> bool:
        session = next(get_session())
        db_study_category = session.exec(
            select(StudyCategory).where(StudyCategory.id == id)
        ).first()

        if db_study_category:
            session.delete(db_study_category)
            session.commit()
            return True

        return False
