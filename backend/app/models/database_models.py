"""
SQLAlchemy database models matching the PostgreSQL schema.
"""

import enum
import uuid

from sqlalchemy import (
    ARRAY,
    BigInteger,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import INET, JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


# Enum definitions matching PostgreSQL enums
class UserRole(str, enum.Enum):
    VIEWER = "viewer"
    CURATOR = "curator"
    ADMIN = "admin"


class PrecurationDecision(str, enum.Enum):
    LUMP = "Lump"
    SPLIT = "Split"
    UNDECIDED = "Undecided"


class CurationVerdict(str, enum.Enum):
    DEFINITIVE = "Definitive"
    STRONG = "Strong"
    MODERATE = "Moderate"
    LIMITED = "Limited"
    NO_KNOWN_DISEASE_RELATIONSHIP = "No Known Disease Relationship"
    DISPUTED = "Disputed"
    REFUTED = "Refuted"


class WorkflowStatus(str, enum.Enum):
    DRAFT = "Draft"
    IN_PRIMARY_REVIEW = "In_Primary_Review"
    IN_SECONDARY_REVIEW = "In_Secondary_Review"
    APPROVED = "Approved"
    PUBLISHED = "Published"
    REJECTED = "Rejected"


# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(
        Enum(UserRole, values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default="viewer",
        index=True,
    )
    is_active = Column(Boolean, default=True, index=True)
    last_login = Column(DateTime(timezone=True))
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    created_genes = relationship(
        "Gene", foreign_keys="[Gene.created_by]", back_populates="creator"
    )
    updated_genes = relationship(
        "Gene", foreign_keys="[Gene.updated_by]", back_populates="updater"
    )
    created_precurations = relationship(
        "Precuration", foreign_keys="[Precuration.created_by]", back_populates="creator"
    )
    created_curations = relationship(
        "Curation", foreign_keys="[Curation.created_by]", back_populates="creator"
    )
    approved_curations = relationship(
        "Curation", foreign_keys="[Curation.approved_by]", back_populates="approver"
    )


class Gene(Base):
    __tablename__ = "genes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hgnc_id = Column(String(50), unique=True, nullable=False, index=True)
    approved_symbol = Column(String(100), nullable=False, index=True)
    previous_symbols = Column(ARRAY(Text))
    alias_symbols = Column(ARRAY(Text))
    chromosome = Column(String(10), index=True)
    location = Column(String(50))

    # Flexible details storage
    details = Column(JSONB, default={})

    # Provenance tracking
    record_hash = Column(String(64), unique=True, nullable=False)
    previous_hash = Column(String(64))

    # Metadata
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))

    # Relationships
    creator = relationship(
        "User", foreign_keys=[created_by], back_populates="created_genes"
    )
    updater = relationship(
        "User", foreign_keys=[updated_by], back_populates="updated_genes"
    )
    precurations = relationship("Precuration", back_populates="gene")
    curations = relationship("Curation", back_populates="gene")


class Precuration(Base):
    __tablename__ = "precurations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gene_id = Column(
        UUID(as_uuid=True),
        ForeignKey("genes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Core precuration fields
    mondo_id = Column(String(50), nullable=False, index=True)
    mode_of_inheritance = Column(Text, nullable=False)
    lumping_splitting_decision = Column(
        Enum(PrecurationDecision, values_callable=lambda obj: [e.value for e in obj]),
        default="Undecided",
        index=True,
    )
    rationale = Column(Text)

    # Workflow status
    status = Column(
        Enum(WorkflowStatus, values_callable=lambda obj: [e.value for e in obj]),
        default="Draft",
        index=True,
    )

    # Flexible details storage
    details = Column(JSONB, nullable=False, default={})

    # Provenance tracking
    record_hash = Column(String(64), unique=True, nullable=False)
    previous_hash = Column(String(64))

    # Metadata
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))

    # Relationships
    gene = relationship("Gene", back_populates="precurations")
    creator = relationship(
        "User", foreign_keys=[created_by], back_populates="created_precurations"
    )
    curations = relationship("Curation", back_populates="precuration")


class Curation(Base):
    __tablename__ = "curations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gene_id = Column(
        UUID(as_uuid=True),
        ForeignKey("genes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    precuration_id = Column(
        UUID(as_uuid=True), ForeignKey("precurations.id", ondelete="SET NULL")
    )

    # Core entity definition
    mondo_id = Column(String(50), nullable=False, index=True)
    mode_of_inheritance = Column(Text, nullable=False)
    disease_name = Column(Text, nullable=False)

    # Core ClinGen metrics
    verdict = Column(
        Enum(CurationVerdict, values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        index=True,
    )
    genetic_evidence_score = Column(Numeric(4, 2), nullable=False, default=0.0)
    experimental_evidence_score = Column(Numeric(4, 2), nullable=False, default=0.0)
    total_score = Column(Numeric(4, 2), nullable=False, default=0.0, index=True)
    has_contradictory_evidence = Column(Boolean, nullable=False, default=False)

    # ClinGen summary & workflow
    summary_text = Column(Text)
    gcep_affiliation = Column(Text, nullable=False, index=True)
    sop_version = Column(String(10), nullable=False, default="v11")
    status = Column(
        Enum(WorkflowStatus, values_callable=lambda obj: [e.value for e in obj]),
        default="Draft",
        index=True,
    )
    approved_at = Column(DateTime(timezone=True), index=True)
    published_at = Column(DateTime(timezone=True), index=True)

    # Decentralization & verifiability
    record_hash = Column(String(64), unique=True, nullable=False)
    previous_hash = Column(String(64))
    origin_node_id = Column(UUID(as_uuid=True))

    # Detailed evidence store
    details = Column(JSONB, nullable=False)

    # Metadata
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    approved_by = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )

    # Relationships
    gene = relationship("Gene", back_populates="curations")
    precuration = relationship("Precuration", back_populates="curations")
    creator = relationship(
        "User", foreign_keys=[created_by], back_populates="created_curations"
    )
    approver = relationship(
        "User", foreign_keys=[approved_by], back_populates="approved_curations"
    )


class ChangeLog(Base):
    __tablename__ = "change_log"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    entity_type = Column(Text, nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    operation = Column(Text, nullable=False)
    record_hash = Column(String(64), nullable=False)
    previous_hash = Column(String(64))
    changes = Column(JSONB)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    timestamp = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    ip_address = Column(INET)
    user_agent = Column(Text)

    # Indexes
    __table_args__ = (
        Index("idx_change_log_entity", "entity_type", "entity_id"),
        Index("idx_change_log_user", "user_id"),
        Index("idx_change_log_timestamp", "timestamp"),
        Index("idx_change_log_operation", "operation"),
    )


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token_jti = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(INET)
    user_agent = Column(Text)
    is_active = Column(Boolean, default=True, index=True)


class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    key_hash = Column(String(255), unique=True, nullable=False, index=True)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    permissions = Column(ARRAY(Text), default=[])
    last_used = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
