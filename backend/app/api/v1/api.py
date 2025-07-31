"""
Main API router for v1 endpoints.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import health, auth, genes

# Create main API router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(genes.router, prefix="/genes", tags=["genes"])

# Placeholder for future endpoints
# api_router.include_router(curations.router, prefix="/curations", tags=["curations"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])