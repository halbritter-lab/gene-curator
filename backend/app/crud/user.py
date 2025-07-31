"""
CRUD operations for User model.
"""


from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.database_models import User
from app.schemas.auth import UserCreate, UserUpdate


class UserCRUD:
    """CRUD operations for User model."""

    def get(self, db: Session, user_id: str) -> User | None:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, db: Session, email: str) -> User | None:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """Get multiple users with pagination."""
        return db.query(User).offset(skip).limit(limit).all()

    def create(self, db: Session, user_create: UserCreate) -> User:
        """Create a new user."""
        # Hash the password
        hashed_password = get_password_hash(user_create.password)

        # Create user object
        db_user = User(
            email=user_create.email,
            hashed_password=hashed_password,
            name=user_create.name,
            role=user_create.role,
            is_active=user_create.is_active,
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def update(
        self, db: Session, user_id: str, user_update: UserUpdate
    ) -> User | None:
        """Update user information."""
        db_user = self.get(db, user_id)
        if not db_user:
            return None

        update_data = user_update.dict(exclude_unset=True)

        for field, value in update_data.items():
            setattr(db_user, field, value)

        db.commit()
        db.refresh(db_user)
        return db_user

    def update_password(
        self, db: Session, user_id: str, new_password: str
    ) -> User | None:
        """Update user password."""
        db_user = self.get(db, user_id)
        if not db_user:
            return None

        db_user.hashed_password = get_password_hash(new_password)
        db.commit()
        db.refresh(db_user)
        return db_user

    def authenticate(self, db: Session, email: str, password: str) -> User | None:
        """Authenticate user with email and password."""
        user = self.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        """Check if user is active."""
        return user.is_active

    def is_admin(self, user: User) -> bool:
        """Check if user is admin."""
        return user.role == "admin"

    def delete(self, db: Session, user_id: str) -> User | None:
        """Delete user."""
        db_user = self.get(db, user_id)
        if not db_user:
            return None

        db.delete(db_user)
        db.commit()
        return db_user

    def update_last_login(self, db: Session, user_id: str) -> User | None:
        """Update user's last login timestamp."""
        from sqlalchemy import func

        db_user = self.get(db, user_id)
        if not db_user:
            return None

        db_user.last_login = func.now()
        db.commit()
        db.refresh(db_user)
        return db_user

    def search(
        self, db: Session, query: str, skip: int = 0, limit: int = 100
    ) -> list[User]:
        """Search users by name or email."""
        from sqlalchemy import func, or_

        search_filter = or_(
            func.lower(User.name).contains(func.lower(query)),
            func.lower(User.email).contains(func.lower(query)),
        )

        return db.query(User).filter(search_filter).offset(skip).limit(limit).all()

    def get_statistics(self, db: Session) -> dict:
        """Get user statistics."""
        from sqlalchemy import func

        total_users = db.query(func.count(User.id)).scalar()
        active_users = (
            db.query(func.count(User.id)).filter(User.is_active is True).scalar()
        )

        # Count by role
        role_counts = db.query(User.role, func.count(User.id)).group_by(User.role).all()
        roles_dict = dict(role_counts)

        # Recent registrations (last 30 days)
        from datetime import datetime, timedelta

        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_registrations = (
            db.query(func.count(User.id))
            .filter(User.created_at >= thirty_days_ago)
            .scalar()
        )

        return {
            "total_users": total_users,
            "active_users": active_users,
            "inactive_users": total_users - active_users,
            "roles": roles_dict,
            "recent_registrations": recent_registrations,
        }

    def get_user_activity(self, db: Session, user_id: str) -> dict:
        """Get user activity summary."""
        user = self.get(db, user_id)
        if not user:
            return {}

        # Get basic user info
        activity = {
            "user_id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "last_login": user.last_login,
            "created_at": user.created_at,
            "is_active": user.is_active,
        }

        # Get counts from related tables (if they exist)
        try:
            from app.models.database_models import Curation, Gene, Precuration

            # Count genes created/updated by user
            genes_created = (
                db.query(func.count(Gene.id))
                .filter(Gene.created_by == user.id)
                .scalar()
                or 0
            )
            genes_updated = (
                db.query(func.count(Gene.id))
                .filter(Gene.updated_by == user.id)
                .scalar()
                or 0
            )

            # Count precurations created/updated by user
            precurations_created = (
                db.query(func.count(Precuration.id))
                .filter(Precuration.created_by == user.id)
                .scalar()
                or 0
            )
            precurations_updated = (
                db.query(func.count(Precuration.id))
                .filter(Precuration.updated_by == user.id)
                .scalar()
                or 0
            )

            # Count curations created/updated by user
            curations_created = (
                db.query(func.count(Curation.id))
                .filter(Curation.created_by == user.id)
                .scalar()
                or 0
            )
            curations_updated = (
                db.query(func.count(Curation.id))
                .filter(Curation.updated_by == user.id)
                .scalar()
                or 0
            )
            curations_approved = (
                db.query(func.count(Curation.id))
                .filter(Curation.approved_by == user.id)
                .scalar()
                or 0
            )

            activity.update(
                {
                    "genes_created": genes_created,
                    "genes_updated": genes_updated,
                    "precurations_created": precurations_created,
                    "precurations_updated": precurations_updated,
                    "curations_created": curations_created,
                    "curations_updated": curations_updated,
                    "curations_approved": curations_approved,
                    "total_contributions": genes_created
                    + genes_updated
                    + precurations_created
                    + precurations_updated
                    + curations_created
                    + curations_updated,
                }
            )
        except Exception:
            # If models don't exist yet, just return basic info
            pass

        return activity


# Create instance
user_crud = UserCRUD()
