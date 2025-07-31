"""
Main API router for v1 endpoints.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import health, auth, genes, users

# Create main API router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(genes.router, prefix="/genes", tags=["genes"])
api_router.include_router(users.router, prefix="/users", tags=["users"])

# Placeholder for future endpoints
# api_router.include_router(curations.router, prefix="/curations", tags=["curations"])