"""
Authentication-related Pydantic schemas.
"""

from typing import Optional, Union
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
import uuid

from app.models.database_models import UserRole

class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=255)
    role: str = "viewer"  # Use string directly, validated by enum constraint in DB
    is_active: bool = True

class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8, max_length=128)

class UserUpdate(BaseModel):
    """Schema for updating user information."""
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    role: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    """Schema for user responses (excludes sensitive data)."""
    id: Union[str, uuid.UUID]
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            uuid.UUID: str  # Convert UUID to string in JSON
        }

class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str = Field(..., min_length=1)

class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds

class TokenRefresh(BaseModel):
    """Schema for token refresh request."""
    refresh_token: str

class TokenPayload(BaseModel):
    """Schema for JWT token payload."""
    sub: str  # user ID
    email: str
    role: str
    exp: int
    iat: Optional[int] = None
    type: Optional[str] = "access"  # access or refresh

class PasswordChange(BaseModel):
    """Schema for password change."""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)

class PasswordReset(BaseModel):
    """Schema for password reset request."""
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)