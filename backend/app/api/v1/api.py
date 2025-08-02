"""
Main API router for v1 endpoints.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    curations,
    genes,
    # genes_new,
    # gene_assignments,
    health,
    precurations,
    # schemas,
    # schema_validation,
    # scopes,
    users,
)

# Create main API router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

# Schema-agnostic system endpoints (temporarily disabled for basic setup)
# api_router.include_router(scopes.router, prefix="/scopes", tags=["scopes"])
# api_router.include_router(schemas.router, prefix="/schemas", tags=["schemas"])
# api_router.include_router(
#     schema_validation.router, prefix="/validation", tags=["validation"]
# )
# api_router.include_router(
#     gene_assignments.router, prefix="/gene-assignments", tags=["gene-assignments"]
# )
# api_router.include_router(workflow.router, prefix="/workflow", tags=["workflow"])

# Core entity endpoints
api_router.include_router(genes.router, prefix="/genes", tags=["genes"])
# api_router.include_router(genes_new.router, prefix="/genes-new", tags=["genes-new"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(
    precurations.router, prefix="/precurations", tags=["precurations"]
)
api_router.include_router(curations.router, prefix="/curations", tags=["curations"])
