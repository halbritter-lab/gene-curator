# Gene Curator - ClinGen Compliant Genetic Curation Platform

> **🚧 ARCHITECTURE REFACTOR IN PROGRESS**
> 
> This project is currently undergoing a major architectural transformation to implement native ClinGen Standard Operating Procedure (SOP v11) compliance and migrate to a modern three-tier architecture.

## Project Status

- **Current State**: Refactoring in progress on `refactor` branch
- **Target Architecture**: PostgreSQL + FastAPI + Vue 3/Vite with automated ClinGen compliance
- **Original Implementation**: Archived in `plan/archived/current_codebase/`

## Refactor Overview

Gene Curator is being transformed from a Firebase-based monolithic architecture to a modern, containerized three-tier system that natively enforces ClinGen scientific standards:

### Key Innovations
- **Automated ClinGen Compliance**: Native SOP v11 evidence scoring and summary generation
- **Scientific Rigor**: Immutable data primitives with verifiable provenance
- **Enhanced Performance**: PostgreSQL queries, FastAPI backend, Vite frontend
- **Professional Workflow**: Multi-stage review process with complete audit trails

### Architecture Transformation

| Component | Current | Target | Benefits |
|-----------|---------|---------|----------|
| Database | Firestore | PostgreSQL 15+ | ACID compliance, complex queries, ClinGen schema |
| Backend | Firebase Functions | FastAPI + SQLAlchemy | Type safety, ClinGen business logic, performance |
| Frontend | Vue 3 + Vue CLI | Vue 3 + Vite + Pinia | Modern builds, state management, ClinGen UI |
| Standards | Manual | Automated ClinGen SOP | Evidence scoring, summary generation, compliance |

## Development Structure

The refactor is organized into parallel work streams:

```
plan/
├── database/           # PostgreSQL schema and migration
├── api/               # FastAPI backend with ClinGen engine
├── frontend/          # Vue 3 + Vite migration
└── archived/          # Reference documentation and current codebase
```

See `plan/README.md` for complete refactoring documentation.

## Getting Started

### For Development
1. **Choose Work Stream**: Database, API, or Frontend
2. **Read Work Stream Plan**: `plan/{workstream}/README.md`
3. **Review Archived Code**: `plan/archived/current_codebase/`
4. **Follow Implementation Guide**: Each work stream has detailed instructions

### For Reference
- **Current Implementation**: `plan/archived/current_codebase/`
- **Original Plan**: `plan/archived/PLAN_ORIGINAL.md`
- **Firebase Documentation**: `plan/archived/firebase/README.md`
- **Vue CLI Documentation**: `plan/archived/frontend_vue_cli/README.md`

## ClinGen Integration

The refactored system implements native support for:
- **Evidence Scoring**: Automated calculation per SOP v11 matrix
- **Summary Generation**: Template-driven text per Evidence Summary Template v5.1
- **Nomenclature Validation**: ClinGen dyadic naming conventions
- **Workflow Compliance**: Professional curation review processes

## Key Features (Target)

### Scientific Rigor
- ✅ Automatic ClinGen SOP v11 evidence scoring
- ✅ Template-driven evidence summary generation
- ✅ Immutable record chains with cryptographic verification
- ✅ Complete provenance tracking with source attribution

### Enhanced Performance
- ✅ PostgreSQL for complex queries and ACID transactions
- ✅ FastAPI backend with automatic API documentation
- ✅ Vue 3 + Vite for 50% faster builds and development
- ✅ Code splitting and optimized production bundles

### Preserved Strengths
- ✅ Configuration-driven workflow system
- ✅ Dynamic form rendering based on field definitions
- ✅ Multi-stage gene → precuration → curation workflow
- ✅ Role-based access control (admin, curator, viewer)

## Contributing

### Current Phase: Parallel Implementation
Each work stream can be developed independently:

1. **Database Team**: Implement PostgreSQL schema and migration scripts
2. **API Team**: Build FastAPI backend with ClinGen scoring engine
3. **Frontend Team**: Migrate to Vue 3/Vite and build ClinGen components

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.11+ (backend)
- PostgreSQL 15+ (database)
- Docker (deployment)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **ClinGen Consortium**: For establishing the Gene-Disease Validity Standard Operating Procedures
- **Original Implementation**: Vue CLI + Firebase architecture that established successful workflow patterns
- **Scientific Community**: For the principles of verifiable, attributable, and replicable genetic curation

---

**Note**: This is a scientific application for genetic research. The refactor prioritizes scientific rigor, data integrity, and ClinGen compliance above all other considerations.
