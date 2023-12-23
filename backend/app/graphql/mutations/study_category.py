import strawberry
from sqlmodel import select, update
from ...models import StudyCategory
from ...database import get_session
from ..schemas.models import StudyCategoryType
from ..schemas.inputs import StudyCategoryInput


@strawberry.type
class StudyCategoryMutations:
    @strawberry.mutation
    def create_study_category(
        self, study_category: StudyCategoryInput, info: strawberry.types.Info
    ) -> StudyCategoryType:
        user_id = getattr(info.context["request"].state, "user_id", None)
        if user_id is None:
            # Handle case where user_id is not found
            raise ValueError("User ID is required")

        session = next(get_session())
        existing_category = session.exec(
            select(StudyCategory).where(
                StudyCategory.title == study_category.title,
                StudyCategory.user_id == user_id,
            )
        ).first()

        if existing_category:
            raise ValueError(f"Category '{study_category.title}' already exists")

        study_category_data = strawberry.asdict(study_category)
        study_category_data["user_id"] = user_id
        new_category = StudyCategory(**study_category_data)

        session.add(new_category)
        session.commit()
        session.refresh(new_category)

        return StudyCategory.from_orm(new_category)

    @strawberry.mutation
    def update_study_category(
        self, id: int, study_category: StudyCategoryInput
    ) -> StudyCategoryType:
        session = next(get_session())
        db_study_category = session.exec(
            select(StudyCategory).where(StudyCategory.id == id)
        ).first()

        if db_study_category:
            study_category_data = strawberry.asdict(study_category)
            if study_category_data.get("is_active"):
                # Make sure only one category is active at a time
                session.exec(
                    update(StudyCategory)
                    .where(
                        StudyCategory.user_id == db_study_category.user_id,
                        StudyCategory.id != id,
                        StudyCategory.is_active == True,
                    )
                    .values(is_active=False)
                )

            # Update the fields if they are not None
            for field, value in study_category_data.items():
                if value is not None:
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
