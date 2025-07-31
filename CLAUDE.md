# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Gene Curator Project Overview

Gene Curator is a Vue.js-based platform for genetic information curation and management, featuring a sophisticated multi-stage workflow system powered by Firebase. **The project is currently undergoing a major architectural transformation to implement native ClinGen Standard Operating Procedure (SOP v11) compliance and migrate to a modern three-tier architecture.**

### Current Status & Migration Context
- **Current**: Firebase-based monolithic architecture with Vue 3 + Vue CLI
- **Target**: PostgreSQL + FastAPI + Vue 3/Vite with automated ClinGen compliance
- **Key Innovation**: Database schema and business logic that actively enforce ClinGen curation standards
- **Migration Phase**: Planning complete, implementation in progress

## Essential Commands

### Frontend Commands
```bash
# Development
npm run serve       # Start development server (http://localhost:8080)
npm run build       # Build for production (outputs to /dist)
npm run lint        # Run ESLint to check code quality

# Installation
npm install         # Install dependencies (requires Node.js 16.20.0)
```

### Backend Commands
```bash
# Setup and Development
make dev           # Set up development environment with pre-commit hooks
poetry install     # Install Python dependencies

# Code Quality
make lint          # Run all linting checks (ruff, mypy, bandit, poetry)
make format        # Auto-format code with ruff
make type-check    # Run mypy type checking only
make security-check # Run bandit security analysis only

# Testing
make test          # Run pytest tests
make test-cov      # Run tests with coverage report

# Maintenance
make clean         # Clean build artifacts and cache
make update-deps   # Update dependencies and pre-commit hooks
```

## Architecture Overview

### Technology Stack

#### Current Architecture
- **Frontend**: Vue.js 3.2.13 with Composition API
- **UI Framework**: Vuetify 3.4.8 (Material Design)
- **Backend**: Firebase 10.7.1 (Firestore + Authentication)
- **Routing**: Vue Router 4.2.5
- **Build**: Vue CLI Service 5.0.0

#### Target Architecture (ClinGen-Enhanced)
- **Database**: PostgreSQL 15+ with ACID compliance and ClinGen schema support
- **Backend**: FastAPI + SQLAlchemy with automated ClinGen scoring engine
- **Frontend**: Vue 3 + Vite + Pinia with ClinGen-specific UI components
- **Authentication**: JWT + FastAPI Security (replacing Firebase Auth)
- **Deployment**: Docker + Docker Compose (replacing GitHub Pages)
- **Standards Compliance**: Automated ClinGen SOP v11 evidence scoring and summary generation

### Core Architectural Patterns

#### 1. Configuration-Driven Workflow System
The application uses a sophisticated configuration system located in `src/config/workflows/KidneyGeneticsGeneCuration/`:

- **Stage Configurations**: Each workflow stage (gene → precuration → curation) has its own config file
- **Field Definitions**: Each field includes format, validation, visibility rules, and UI styling
- **Dynamic Forms**: Components render forms dynamically based on configuration
- **Prefill Rules**: Automatic data propagation between stages
- **Decision Rules**: Conditional workflow routing (e.g., "Split" vs "Lump" decisions)

#### 2. Store Pattern (src/stores/)
All stores follow a consistent pattern for Firestore operations:

```javascript
// Common store functions
getItems()                              // Fetch all documents
getItem(docId)                          // Fetch single document
createItem(data, userId, config)        // Create with validation
updateItem(docId, data, userId, config) // Update with validation
deleteItem(docId)                       // Delete document
```

Key features:
- Automatic timestamp management (createdAt/updatedAt)
- User tracking (all contributors stored in arrays)
- Configuration-based validation
- Support for CSV import/export

#### 3. Authentication & Authorization
- Firebase Authentication with role-based access control
- Three roles: `admin`, `curator`, `viewer`
- Route guards check authentication and role requirements
- First user automatically becomes admin

#### 4. Component Architecture
- **Configuration-driven UI**: Components dynamically render based on config objects
- **Reusable components**: DataDisplayTable, HelpIcon, MessageSnackbar, ConfirmationModal
- **Form handling**: Dynamic field rendering with built-in validation
- **State management**: Local state with Composition API, Firestore as source of truth

### Key Directories

```
/src
  /components     # Reusable Vue components
  /views          # Page-level components
  /stores         # Firestore data layer
  /router         # Route definitions and guards
  /firebase       # Firebase initialization
  /config         # Application configuration
    /workflows    # Workflow stage configurations
  /utils          # Utility functions and validators
```

### Data Flow

#### Current Firebase Architecture
```
Gene Data → Precuration Stage → Curation Stage(s)
    ↓            ↓                    ↓
  genes/     precurations/       curations/
```

- Each stage references the previous stage's data
- Multiple curations can be created from one precuration
- All documents track contributing users and timestamps
- Configuration-driven field validation and UI rendering

#### Target ClinGen Architecture
```
Gene Data → Precuration → ClinGen Evidence Collection → Automated Scoring → Curation
    ↓           ↓                    ↓                        ↓            ↓
  genes/   precurations/    evidence_entries/         scoring_engine/  curations/
                                                           ↓
                                                   summary_generator/
```

**Enhanced Flow**:
- **Evidence Collection**: Multi-category evidence entry (case-level, segregation, experimental)
- **Automated Scoring**: Real-time ClinGen SOP v11 compliance scoring
- **Summary Generation**: Template-driven evidence summary creation
- **Verdict Assignment**: Automated classification based on evidence scores
- **Provenance Tracking**: Immutable record chains with cryptographic verification

### Working with Configurations

#### Current Configuration System
Located in `src/config/workflows/KidneyGeneticsGeneCuration/`:

**Field Definition Requirements**:
1. Each field must have: `key`, `label`, `format`, `required`
2. Optional properties: `tableView`, `standardView`, `curationView`, `group`, `order`
3. Field formats: text, number, boolean, array, map, date, object
4. UI styles: text-field, select, switch, textarea, checkbox

**Configuration Files**:
- `geneDetailsConfig.js`: Gene-level data fields
- `precurationDetailsConfig.js`: Precuration stage fields
- `curationDetailsConfig.js`: Curation stage fields
- `workflowConfig.js`: Overall workflow orchestration
- `static/*.json`: Help content for each stage

#### Planned ClinGen Configuration Enhancement
**New ClinGen-Specific Components**:
- `clingenEvidenceConfig.js`: Evidence collection field definitions
- `clingenScoringConfig.js`: Scoring matrix configurations
- `clingenNomenclatureConfig.js`: Disease naming validation rules
- `clingenTemplateConfig.js`: Evidence summary template definitions

**ClinGen Evidence Field Types**:
- `evidence-entry`: Structured evidence input with PMID validation
- `score-display`: Real-time evidence score visualization
- `verdict-selector`: ClinGen classification dropdown
- `summary-preview`: Auto-generated evidence summary display

### Environment Setup

Create `.env.local` with Firebase configuration:
```
VUE_APP_FIREBASE_API_KEY=...
VUE_APP_FIREBASE_AUTH_DOMAIN=...
VUE_APP_FIREBASE_PROJECT_ID=...
VUE_APP_FIREBASE_STORAGE_BUCKET=...
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=...
VUE_APP_FIREBASE_APP_ID=...
```

### Deployment

The application is configured for GitHub Pages deployment:
- Production builds use `/gene-curator/` as base path
- Deployment handled via GitHub Actions (`.github/workflows/gh-pages.yml`)
- Build output in `/dist` directory
- Node.js version 16.20.0 required for compatibility

## ClinGen Integration & Architecture Transformation

### ClinGen Standard Operating Procedure (SOP) Compliance

The project is implementing native support for ClinGen SOP v11 requirements:

#### Core ClinGen Components
1. **Evidence Scoring Engine**: Automated calculation of genetic and experimental evidence scores
2. **Summary Generator**: Programmatic generation of evidence summaries per Template v5.1
3. **Dyadic Naming System**: Support for ClinGen disease naming conventions
4. **GCEP Workflow Integration**: Compliance with Gene Curation Expert Panel processes

#### ClinGen Data Architecture

**Enhanced PostgreSQL Schema**:
```sql
-- Core ClinGen verdicts and scoring
CREATE TYPE curation_verdict AS ENUM (
    'Definitive', 'Strong', 'Moderate', 'Limited', 
    'No Known Disease Relationship', 'Disputed', 'Refuted'
);

CREATE TABLE curations (
    -- Core ClinGen metrics
    verdict curation_verdict NOT NULL,
    genetic_evidence_score NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    experimental_evidence_score NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    total_score NUMERIC(4, 2) GENERATED ALWAYS AS (genetic_evidence_score + experimental_evidence_score) STORED,
    
    -- Auto-generated evidence summary
    summary_text TEXT, -- Generated from Evidence Summary Template v5.1
    sop_version VARCHAR(10) NOT NULL DEFAULT 'v11',
    
    -- Structured evidence store (JSONB)
    details JSONB NOT NULL -- ClinGen-compliant evidence structure
);
```

**Evidence Structure (curations.details JSONB)**:
- `genetic_evidence`: Case-level data, segregation data, case-control studies
- `experimental_evidence`: Functional studies, model organisms, rescue experiments
- `contradictory_evidence`: Studies that refute the gene-disease relationship
- `lumping_splitting_details`: Rationale for entity definition decisions

#### ClinGen Business Logic

**Automated Scoring System**:
- **Genetic Evidence**: Max 12 points (case-level: 12, segregation: 3, case-control: 6)
- **Experimental Evidence**: Max 6 points across functional, model, and rescue categories
- **Verdict Determination**: Algorithmic classification based on total scores and contradictory evidence

**Evidence Summary Generation**:
- Template-driven text generation following ClinGen Template v5.1
- Automated integration of evidence scores and rationales
- Support for dyadic naming conventions (gene + phenotypic descriptor)

### Migration Architecture Principles

#### Decentralization-Ready Design
- **Immutable Data Primitives**: Every curation treated as versioned, immutable event
- **Verifiable Provenance**: Cryptographic content addressing with SHA-256 hashes
- **Content Integrity**: Tamper-evident records enabling distributed scientific collaboration
- **Event Sourcing Foundation**: Append-only change log for audit trails

#### Three-Tier Architecture Benefits
- **API-First Design**: Clear separation between data, business logic, and presentation
- **Scientific Rigor**: Backend enforces ClinGen compliance automatically
- **Enhanced Performance**: PostgreSQL enables complex queries and ACID transactions
- **Modern Tooling**: Vite build system and Pinia state management

### Development Workflow Considerations

#### ClinGen Compliance Testing
- **Scoring Accuracy Tests**: Validation against SOP v11 examples
- **Summary Generation Tests**: Template compliance verification
- **Scientific Validation**: Expert panel review of implementation
- **Evidence Entry Workflow**: Multi-tab evidence collection with real-time scoring

#### Migration Phases
1. **Phase 0**: Foundation setup and ClinGen schema design ✅
2. **Phase 1**: Backend implementation with scoring engine
3. **Phase 2**: Data migration and API testing with ClinGen validation
4. **Phase 3**: Frontend modernization with ClinGen-specific components
5. **Phase 4**: Comprehensive testing and scientific validation
6. **Phase 5**: Production deployment and user training

## Important File References

### Planning Documentation
- `PLAN.md`: Complete refactoring plan with ClinGen integration details
- `plan/scripts/clingen_documents/`: ClinGen SOP and template reference materials
- `plan/scripts/clingen_documents/INDEX.md`: Index of processed ClinGen documents

### Key Configuration Files
- `src/config/workflows/KidneyGeneticsGeneCuration/workflowConfig.js`: Main workflow orchestration
- `src/stores/geneStore.js`: Gene data management with Firebase operations
- `package.json`: Dependencies and build scripts (Node.js 16.20.0 required)

### Deployment & CI/CD
- `.github/workflows/gh-pages.yml`: GitHub Actions deployment to GitHub Pages
- Uses Node.js 16, builds to `/dist`, creates 404.html fallback

### Development Notes
- **No Testing Framework**: Currently no Jest, Cypress, or other testing setup
- **Linting**: ESLint configured via Vue CLI with `npm run lint`
- **State Management**: Direct Firebase access via stores (no Vuex/Pinia yet)
- **ClinGen Reference Materials**: Available in `plan/scripts/clingen_documents/markdown/`

When working on ClinGen integration, always reference the official SOP v11 and Evidence Summary Template v5.1 materials in the plan directory for accurate implementation.