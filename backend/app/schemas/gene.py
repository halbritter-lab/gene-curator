"""
Gene-related Pydantic schemas.
"""

from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import uuid

class GeneBase(BaseModel):
    """Base gene schema with common fields."""
    hgnc_id: str = Field(..., description="HGNC identifier (e.g., HGNC:1234)")
    approved_symbol: str = Field(..., min_length=1, max_length=100, description="Official gene symbol")
    previous_symbols: Optional[List[str]] = Field(default=[], description="Previously used gene symbols")
    alias_symbols: Optional[List[str]] = Field(default=[], description="Alternative gene symbols")
    chromosome: Optional[str] = Field(None, max_length=10, description="Chromosome location")
    location: Optional[str] = Field(None, max_length=50, description="Chromosomal location (e.g., 17q21.31)")
    gene_family: Optional[List[str]] = Field(default=[], description="Gene family classifications")
    current_dyadic_name: Optional[str] = Field(None, max_length=255, description="ClinGen dyadic naming")
    details: Optional[Dict[str, Any]] = Field(default={}, description="Additional gene metadata")
    
    @field_validator('hgnc_id')
    @classmethod
    def validate_hgnc_id(cls, v: str) -> str:
        """Validate HGNC ID format."""
        if not v.startswith('HGNC:') or not v[5:].isdigit():
            raise ValueError('HGNC ID must be in format HGNC:#### where #### is a number')
        return v

class GeneCreate(GeneBase):
    """Schema for creating a new gene."""
    pass

class GeneUpdate(BaseModel):
    """Schema for updating gene information."""
    hgnc_id: Optional[str] = None
    approved_symbol: Optional[str] = Field(None, min_length=1, max_length=100)
    previous_symbols: Optional[List[str]] = None
    alias_symbols: Optional[List[str]] = None
    chromosome: Optional[str] = Field(None, max_length=10)
    location: Optional[str] = Field(None, max_length=50)
    gene_family: Optional[List[str]] = None
    current_dyadic_name: Optional[str] = Field(None, max_length=255)
    details: Optional[Dict[str, Any]] = None
    
    @field_validator('hgnc_id')
    @classmethod
    def validate_hgnc_id(cls, v: Optional[str]) -> Optional[str]:
        """Validate HGNC ID format if provided."""
        if v is not None and (not v.startswith('HGNC:') or not v[5:].isdigit()):
            raise ValueError('HGNC ID must be in format HGNC:#### where #### is a number')
        return v

class GeneResponse(GeneBase):
    """Schema for gene responses."""
    id: Union[str, uuid.UUID]
    record_hash: str
    previous_hash: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[Union[str, uuid.UUID]] = None
    updated_by: Optional[Union[str, uuid.UUID]] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            uuid.UUID: str
        }

class GeneListResponse(BaseModel):
    """Schema for paginated gene list responses."""
    genes: List[GeneResponse]
    total: int
    skip: int
    limit: int
    has_next: bool
    has_prev: bool

class GeneSearchQuery(BaseModel):
    """Schema for gene search queries."""
    query: Optional[str] = Field(None, description="Search term for gene symbol, name, or HGNC ID")
    chromosome: Optional[str] = Field(None, description="Filter by chromosome")
    gene_family: Optional[List[str]] = Field(None, description="Filter by gene family")
    hgnc_id: Optional[str] = Field(None, description="Filter by specific HGNC ID")
    created_by: Optional[str] = Field(None, description="Filter by creator")
    skip: int = Field(0, ge=0, description="Number of records to skip")
    limit: int = Field(50, ge=1, le=500, description="Maximum number of records to return")
    sort_by: Optional[str] = Field("approved_symbol", description="Field to sort by")
    sort_order: Optional[str] = Field("asc", pattern="^(asc|desc)$", description="Sort order")

class GeneSummary(BaseModel):
    """Minimal gene information for lists and dropdowns."""
    id: Union[str, uuid.UUID]
    hgnc_id: str
    approved_symbol: str
    chromosome: Optional[str] = None
    current_dyadic_name: Optional[str] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            uuid.UUID: str
        }

class GeneStatistics(BaseModel):
    """Gene database statistics."""
    total_genes: int
    genes_by_chromosome: Dict[str, int]
    genes_by_family: Dict[str, int]
    recent_additions: int
    updated_last_week: int

class GeneBulkCreate(BaseModel):
    """Schema for bulk gene creation."""
    genes: List[GeneCreate] = Field(..., min_length=1, max_length=100)
    validate_hgnc: bool = Field(True, description="Whether to validate HGNC IDs against external API")
    skip_duplicates: bool = Field(True, description="Whether to skip genes with existing HGNC IDs")

class GeneBulkCreateResponse(BaseModel):
    """Response for bulk gene creation."""
    created_genes: List[GeneResponse]
    skipped_genes: List[Dict[str, Any]]
    errors: List[Dict[str, Any]]
    total_processed: int
    total_created: int
    total_skipped: int
    total_errors: int