"""
Database models package.
"""

# Import all models to ensure they are registered with SQLAlchemy
from .models import *

# Create aliases for backward compatibility
User = UserNew
UserRole = UserRoleNew

__all__ = [
    # Backward compatibility aliases
    "User",
    "UserRole",
    # New schema-agnostic models
    "UserNew",
    "UserRoleNew",
    "Scope",
    "CurationSchema",
    "WorkflowPair",
    "GeneScopeAssignment",
    "GeneNew",
    "PrecurationNew",
    "CurationNew",
    "Review",
    "ActiveCuration",
    "AuditLogNew",
    "SchemaSelection",
    # Enums
    "WorkflowStage",
    "ReviewStatus",
    "CurationStatus",
    "SchemaType",
]
