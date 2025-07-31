"""
CRUD operations for User model.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.database_models import User
from app.schemas.auth import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
import hashlib

class UserCRUD:
    """CRUD operations for User model."""
    
    def get(self, db: Session, user_id: str) -> Optional[User]:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()
    
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()
    
    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
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
            is_active=user_create.is_active
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def update(self, db: Session, user_id: str, user_update: UserUpdate) -> Optional[User]:
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
    
    def update_password(self, db: Session, user_id: str, new_password: str) -> Optional[User]:
        """Update user password."""
        db_user = self.get(db, user_id)
        if not db_user:
            return None
        
        db_user.hashed_password = get_password_hash(new_password)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def authenticate(self, db: Session, email: str, password: str) -> Optional[User]:
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
    
    def delete(self, db: Session, user_id: str) -> Optional[User]:
        """Delete user."""
        db_user = self.get(db, user_id)
        if not db_user:
            return None
        
        db.delete(db_user)
        db.commit()
        return db_user
    
    def update_last_login(self, db: Session, user_id: str) -> Optional[User]:
        """Update user's last login timestamp."""
        from sqlalchemy import func
        
        db_user = self.get(db, user_id)
        if not db_user:
            return None
        
        db_user.last_login = func.now()
        db.commit()
        db.refresh(db_user)
        return db_user

# Create instance
user_crud = UserCRUD()