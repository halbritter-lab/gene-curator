# Gene Curator Refactoring Plan - Structured Work Streams

This directory contains the complete refactoring plan organized into parallel work streams for efficient development and implementation.

## Work Stream Overview

The refactoring has been structured into three main parallel work streams that can be developed simultaneously:

### 🗄️ Database Work Stream
**Location**: `database/`
**Focus**: PostgreSQL schema design and migration strategy
**Key Deliverables**:
- ClinGen-compliant database schema with native evidence scoring
- Firebase to PostgreSQL migration scripts
- Data integrity validation and testing procedures

### 🔧 API Work Stream  
**Location**: `api/`
**Focus**: FastAPI backend with ClinGen scoring engine
**Key Deliverables**:
- RESTful API with automatic ClinGen SOP v11 compliance
- Evidence scoring engine and summary generation
- Professional curation workflow management

### 🎨 Frontend Work Stream
**Location**: `frontend/`
**Focus**: Vue 3 + Vite migration with ClinGen components
**Key Deliverables**:
- Modern frontend architecture with Vite build system
- Specialized ClinGen evidence entry components
- Enhanced user experience with real-time scoring

## Archived References

### 📁 Archived Documentation
**Location**: `archived/`
**Contents**:
- `PLAN_ORIGINAL.md`: Complete original refactoring plan
- `firebase/`: Current Firebase implementation documentation
- `frontend_vue_cli/`: Current Vue CLI frontend documentation

## Project Structure

```
plan/
├── README.md                    # This overview document
├── database/                    # PostgreSQL migration work stream
│   ├── README.md               # Database work stream overview
│   ├── schema_design.md        # Complete PostgreSQL schema
│   ├── migration_plan.md       # Firebase → PostgreSQL strategy
│   ├── clingen_compliance.md   # ClinGen SOP v11 implementation
│   ├── sql/                    # SQL implementation scripts
│   └── migration/              # Data migration tooling
├── api/                        # FastAPI backend work stream
│   ├── README.md               # API work stream overview
│   ├── architecture.md         # API design patterns
│   ├── clingen_engine.md      # ClinGen scoring engine
│   ├── endpoints.md           # Complete API documentation
│   ├── models.md              # Pydantic schemas
│   ├── authentication.md      # JWT auth and RBAC
│   ├── testing.md             # Testing strategy
│   └── implementation/        # Implementation details
├── frontend/                   # Vue 3 + Vite work stream
│   ├── README.md              # Frontend work stream overview
│   ├── migration_strategy.md  # Vue CLI → Vite migration
│   ├── clingen_components.md  # ClinGen UI components
│   ├── state_management.md    # Pinia store architecture
│   ├── configuration_system.md # Workflow config preservation
│   ├── routing_auth.md        # Route guards and auth
│   ├── testing_strategy.md    # Frontend testing plan
│   └── implementation/        # Implementation details
├── archived/                   # Reference documentation
│   ├── PLAN_ORIGINAL.md       # Complete original plan
│   ├── firebase/              # Current Firebase documentation
│   │   └── README.md          # Firebase implementation reference
│   └── frontend_vue_cli/      # Current frontend documentation
│       └── README.md          # Vue CLI implementation reference
└── scripts/                   # ClinGen reference materials
    ├── clingen_documents/     # Official ClinGen documentation
    └── download_clingen_docs.py # Documentation extraction script
```

## Key Innovations

### 1. ClinGen Native Compliance
- **Database Level**: Evidence scoring implemented as database triggers and constraints
- **API Level**: Automatic SOP v11 scoring and summary generation  
- **Frontend Level**: Specialized components for evidence entry and display

### 2. Scientific Rigor
- **Immutable Records**: Content-addressable with SHA-256 hashes
- **Provenance Tracking**: Complete audit trail with source attribution
- **Evidence Validation**: Automated compliance checking
- **Quality Control**: Multi-stage professional review workflow

### 3. Modern Architecture
- **Type Safety**: End-to-end TypeScript with Pydantic validation
- **Performance**: PostgreSQL queries, Vite builds, code splitting
- **Developer Experience**: Hot reload, auto-documentation, comprehensive testing
- **Scalability**: Containerized deployment with horizontal scaling

## Work Stream Dependencies

### Sequential Dependencies
1. **Database → API**: API models depend on database schema
2. **API → Frontend**: Frontend API client depends on backend contracts
3. **All → Migration**: Data migration requires all systems to be ready

### Parallel Development Opportunities
- Database schema design ↔ API model definition
- ClinGen scoring engine ↔ Frontend scoring components  
- Authentication systems ↔ User management interfaces
- Testing strategies ↔ Validation procedures

## Development Phases

### Phase 0: Foundation (Weeks 1-2)
- [ ] Database schema finalization
- [ ] API architecture and model design
- [ ] Frontend migration strategy completion
- [ ] Development environment setup

### Phase 1: Core Implementation (Weeks 3-6)
- [ ] PostgreSQL schema and migration scripts
- [ ] FastAPI backend with ClinGen engine
- [ ] Vue 3 + Vite frontend migration
- [ ] Basic authentication and CRUD operations

### Phase 2: ClinGen Integration (Weeks 7-10)
- [ ] Evidence scoring engine implementation
- [ ] Summary generation system
- [ ] Specialized ClinGen UI components
- [ ] Professional workflow management

### Phase 3: Testing & Validation (Weeks 11-12)
- [ ] Comprehensive test suites
- [ ] ClinGen compliance validation
- [ ] Performance optimization
- [ ] Security audit

### Phase 4: Migration & Deployment (Weeks 13-14)
- [ ] Data migration execution
- [ ] Production deployment
- [ ] User training and documentation
- [ ] Go-live and monitoring

## Success Metrics

### Technical Metrics
- [ ] 100% data migration accuracy
- [ ] <200ms API response times
- [ ] >90% test coverage across all layers
- [ ] Zero security vulnerabilities

### ClinGen Compliance Metrics
- [ ] 100% SOP v11 scoring accuracy
- [ ] Expert panel validation of summary generation
- [ ] Complete evidence provenance tracking
- [ ] Scientific workflow compliance

### User Experience Metrics
- [ ] 30% reduction in curation time
- [ ] Improved data consistency through automation
- [ ] Enhanced summary quality and standardization
- [ ] Positive expert user feedback

## Getting Started

### For Database Work Stream
1. Read `database/README.md` for work stream overview
2. Review `database/schema_design.md` for detailed schema
3. Check `archived/firebase/README.md` for current data structure
4. Begin with `database/sql/001_initial_schema.sql`

### For API Work Stream  
1. Read `api/README.md` for work stream overview
2. Study `api/clingen_engine.md` for scoring implementation
3. Review database schema for model design alignment
4. Begin with FastAPI project setup

### For Frontend Work Stream
1. Read `frontend/README.md` for work stream overview
2. Review `frontend/migration_strategy.md` for Vite migration
3. Check `archived/frontend_vue_cli/README.md` for current architecture
4. Begin with Vite configuration and basic migration

## Integration Points

Each work stream has defined integration points to ensure compatibility:

- **Database ↔ API**: SQLAlchemy models mirror database schema exactly
- **API ↔ Frontend**: OpenAPI specification provides typed API contracts
- **All ↔ Configuration**: Existing workflow configs preserved and enhanced
- **All ↔ Authentication**: Consistent user management and role-based access

## Risk Mitigation

### High-Risk Areas
1. **Data Migration Complexity**: Comprehensive backup and validation procedures
2. **ClinGen Compliance**: Expert panel review and official validation
3. **User Adoption**: Extensive training and gradual rollout

### Medium-Risk Areas  
1. **Performance**: Caching strategies and optimization monitoring
2. **Integration**: API versioning and backward compatibility
3. **Timeline**: Parallel development with defined integration milestones

The structured approach ensures each work stream can proceed independently while maintaining integration compatibility, maximizing development efficiency and minimizing project risk.