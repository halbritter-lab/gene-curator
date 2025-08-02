# Gene Curator Development Makefile
# Provides common development commands for the three-tier architecture

.PHONY: help dev dev-build dev-down dev-logs clean test lint format

# Default target
help:
	@echo "Gene Curator Development Commands:"
	@echo ""
	@echo "  dev          - Start development environment"
	@echo "  dev-build    - Build and start development environment"
	@echo "  dev-down     - Stop development environment"
	@echo "  dev-logs     - Show development logs"
	@echo "  clean        - Clean up Docker resources"
	@echo "  test         - Run tests"
	@echo "  lint         - Run linting"
	@echo "  format       - Format code"
	@echo "  db-init      - Initialize database"
	@echo "  db-reset     - Reset database"
	@echo ""

# Development environment
dev:
	@echo "Starting Gene Curator development environment..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "Development environment started!"
	@echo "API: http://localhost:8000"
	@echo "Frontend: http://localhost:3001"
	@echo "Database: localhost:5433"

dev-build:
	@echo "Building and starting development environment..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

dev-down:
	@echo "Stopping development environment..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Database commands
db-init:
	@echo "Initializing database..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec postgres /bin/bash -c "cd /docker-entrypoint-initdb.d && ./init.sh"

db-reset:
	@echo "Resetting database..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres
	sleep 10
	make db-init

# Testing
test:
	@echo "Running tests..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend poetry run pytest

test-backend:
	@echo "Running backend tests..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend poetry run pytest app/tests/

test-frontend:
	@echo "Running frontend tests..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec frontend npm run test

# Code quality
lint:
	@echo "Running linting..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend poetry run flake8 app/
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend poetry run mypy app/

format:
	@echo "Formatting code..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend poetry run black app/
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend poetry run isort app/

# Cleanup
clean:
	@echo "Cleaning up Docker resources..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v --remove-orphans
	docker system prune -f

# Health checks
health:
	@echo "Checking service health..."
	@curl -s http://localhost:8000/health | jq . || echo "Backend not responding"
	@curl -s http://localhost:3001 | head -1 || echo "Frontend not responding"

# Database access
db-shell:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec postgres psql -U dev_user -d gene_curator_dev

# Backend shell
backend-shell:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend /bin/bash

# Show status
status:
	@echo "Service Status:"
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps