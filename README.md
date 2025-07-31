# Gene Curator - ClinGen Compliant Genetic Curation Platform

> **🚀 NEW ARCHITECTURE IMPLEMENTED**
> 
> The project has been successfully restructured with a modern three-tier architecture featuring native ClinGen Standard Operating Procedure (SOP v11) compliance and automated evidence scoring.

## Architecture Overview

Gene Curator is now built as a containerized three-tier system that natively enforces ClinGen scientific standards:

### 🏗️ Architecture Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Database** | PostgreSQL 15+ | ACID compliance, ClinGen schema, automated scoring |
| **Backend** | FastAPI + SQLAlchemy | Type-safe API, ClinGen business logic |
| **Frontend** | Vue 3 + Vite + Pinia | Modern UI, ClinGen components |
| **Orchestration** | Docker Compose | Development and deployment |

### 🧬 ClinGen Integration

- **Automated Evidence Scoring**: Native SOP v11 scoring matrix implementation
- **Summary Generation**: Template-driven evidence summaries per Template v5.1
- **Scientific Rigor**: Immutable records with cryptographic verification
- **Professional Workflow**: Multi-stage review with complete audit trails

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Make (optional, for convenience commands)
- Git

### Development Setup

1. **Clone and start the development environment:**
   ```bash
   git clone https://github.com/halbritter-lab/gene-curator.git
   cd gene-curator
   make dev
   ```

2. **Access the applications:**
   - **API Documentation**: http://localhost:8000/docs
   - **Frontend Application**: http://localhost:3000
   - **Database**: localhost:5433 (credentials in docker-compose.dev.yml)

3. **Check service health:**
   ```bash
   make health
   ```

### Alternative Setup (without Make)

```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Stop environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

## Development Commands

```bash
# Environment management
make dev          # Start development environment
make dev-build    # Rebuild and start
make dev-down     # Stop environment
make dev-logs     # View logs

# Database operations
make db-init      # Initialize database with schema and seed data
make db-reset     # Reset database completely
make db-shell     # Access PostgreSQL shell

# Code quality
make test         # Run all tests
make lint         # Run linting
make format       # Format code

# Utilities
make status       # Show service status
make clean        # Clean up Docker resources
```

## Database Features

### ClinGen SOP v11 Compliance

The database implements native ClinGen compliance through:

- **Automatic Scoring Triggers**: Evidence scores calculated per SOP v11 matrix
- **Verdict Classification**: Algorithmic determination of curation verdicts
- **Provenance Tracking**: Complete audit trail with SHA-256 record hashes
- **Evidence Validation**: Structured JSONB evidence store with validation

### Sample Data

The development database includes:
- **Sample Users**: Admin, curator, and viewer accounts
- **Sample Genes**: PKD1, PKD2, NPHP1 with complete metadata
- **Sample Curation**: PKD1 curation with comprehensive ClinGen evidence

**Default Development Credentials:**
- Admin: `admin@gene-curator.org` / `admin123`
- Curator: `curator@gene-curator.org` / `curator123`
- Viewer: `viewer@gene-curator.org` / `viewer123`

## API Features

### FastAPI Backend

- **OpenAPI Documentation**: Automatic API documentation at `/docs`
- **Type Safety**: Full Pydantic validation and serialization
- **Health Checks**: Database and ClinGen engine health monitoring
- **Authentication**: JWT-based authentication (implementation in progress)

### ClinGen Scoring Engine

The backend includes a complete ClinGen scoring implementation:

```python
# Example: Test the scoring engine
curl -X GET "http://localhost:8000/api/v1/health/detailed"
```

## Frontend Architecture

The frontend will feature:
- **Vue 3 + Composition API**: Modern reactive framework
- **Vite Build System**: Lightning-fast development and builds
- **Pinia State Management**: Type-safe centralized state
- **ClinGen Components**: Specialized evidence entry and display components

*Frontend implementation is planned for the next development phase.*

## Configuration System

The system preserves the successful configuration-driven approach:
- **Workflow Configurations**: Stored in database and referenced by frontend
- **Dynamic Form Rendering**: Components render based on configuration
- **Field Validation**: Server-side validation with configuration rules
- **Help System**: Contextual help integrated with field configurations

## Project Structure

```
gene-curator/
├── backend/                 # FastAPI backend application
│   ├── app/                # Application code
│   │   ├── api/v1/         # API endpoints
│   │   ├── core/           # Core functionality (config, database)
│   │   │   └── clingen/    # ClinGen scoring engine
│   │   ├── models/         # SQLAlchemy models
│   │   └── schemas/        # Pydantic schemas
│   ├── alembic/            # Database migrations
│   └── tests/              # Backend tests
├── frontend/               # Vue 3 + Vite frontend (planned)
├── database/               # Database setup and migrations
│   ├── sql/                # Schema and trigger definitions
│   └── seeds/              # Sample data
├── docker/                 # Docker configurations
├── plan/                   # Development planning documentation
│   └── archived/           # Original codebase reference
└── docs/                   # Project documentation
```

## Scientific Features

### Evidence Management
- **Structured Evidence Entry**: Forms for case-level, segregation, and experimental evidence
- **Automatic Scoring**: Real-time calculation per ClinGen SOP v11
- **Evidence Summary**: Template-driven summary generation
- **External Integration**: Support for PanelApp, ClinVar, and other sources

### Quality Assurance
- **Multi-stage Review**: Primary and secondary curator review process
- **Change Tracking**: Complete audit log of all modifications
- **Verification**: Cryptographic record verification for scientific integrity
- **Compliance Monitoring**: Automated ClinGen standard compliance checking

## Development Roadmap

### Phase 1: Backend Foundation ✅
- [x] PostgreSQL schema with ClinGen compliance
- [x] FastAPI application structure
- [x] Docker development environment
- [x] Database triggers for automatic scoring
- [x] Health monitoring and API documentation

### Phase 2: API Implementation (In Progress)
- [ ] Authentication and authorization system
- [ ] Complete CRUD operations for genes, precurations, curations
- [ ] ClinGen scoring engine API endpoints
- [ ] Evidence summary generation API
- [ ] Advanced search and filtering

### Phase 3: Frontend Development (Planned)
- [ ] Vue 3 + Vite application setup
- [ ] Pinia state management implementation
- [ ] ClinGen evidence entry components
- [ ] Real-time scoring display
- [ ] Workflow management interface

### Phase 4: Production Readiness (Planned)
- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment automation
- [ ] User documentation

## Contributing

The project is organized for parallel development across work streams:

1. **Database Team**: Work in `database/` and `backend/app/models/`
2. **API Team**: Work in `backend/app/api/` and `backend/app/core/`
3. **Frontend Team**: Work in `frontend/` (when ready)

See individual work stream documentation in the `plan/` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **ClinGen Consortium**: For establishing the Gene-Disease Validity Standard Operating Procedures
- **Original Implementation**: Vue CLI + Firebase architecture that established successful workflow patterns
- **Scientific Community**: For the principles of verifiable, attributable, and replicable genetic curation

---

**Note**: This is a scientific application for genetic research. The refactor prioritizes scientific rigor, data integrity, and ClinGen compliance above all other considerations.
