# Gene Curator - System Architecture

## Overview

Gene Curator implements a comprehensive three-tier genetic curation platform with native ClinGen SOP v11 compliance. This document outlines the overall system architecture and design principles.

## Architecture Summary

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend       │    │   Backend       │    │   Database      │
│  Vue 3 + Vite   │◄──►│  FastAPI        │◄──►│  PostgreSQL     │
│  + Pinia        │    │  + SQLAlchemy   │    │  + JSONB        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
      │                          │                      │
      ▼                          ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ • ClinGen UI    │    │ • Evidence      │    │ • ClinGen       │
│ • Real-time     │    │   Scoring       │    │   Schema        │
│   Validation    │    │ • Auto Summary  │    │ • Triggers      │
│ • Workflow      │    │ • RBAC          │    │ • Constraints   │
│   Management    │    │ • JWT Auth      │    │ • Audit Log     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Tier 1: Database Layer (PostgreSQL + JSONB)

### Core Responsibilities
- **ClinGen Schema Enforcement**: Native SOP v11 compliance at database level
- **Evidence Storage**: JSONB structure for flexible, queryable evidence data
- **Automated Scoring**: Database triggers calculate ClinGen scores automatically
- **Data Integrity**: Content-addressable records with SHA-256 hashing
- **Audit Trail**: Complete change tracking with user attribution

### Key Features
- PostgreSQL 15+ with ACID compliance
- JSONB for structured, indexed evidence data
- Database-level ClinGen score validation
- Automated evidence summary generation triggers
- Provenance tracking with immutable record chains

### Performance Optimizations
- GIN indexes on JSONB evidence structures
- Computed columns for score calculations
- Partial indexes for workflow states
- Connection pooling for concurrent access

## Tier 2: API Layer (FastAPI + SQLAlchemy)

### Core Responsibilities
- **RESTful API**: Standard HTTP endpoints with OpenAPI documentation
- **ClinGen Business Logic**: Evidence scoring engine and summary generation
- **Authentication**: JWT-based auth with role-based access control
- **Data Validation**: Pydantic schemas with ClinGen-specific validators
- **Workflow Management**: Multi-stage approval process

### Key Features
- FastAPI with automatic OpenAPI/Swagger documentation
- SQLAlchemy ORM with database model mapping
- Pydantic schemas for type-safe request/response handling
- JWT authentication with refresh token support
- Background tasks for intensive operations

### API Structure
```
/api/v1/
├── auth/           # Authentication endpoints
├── genes/          # Gene management
├── precurations/   # Pre-curation workflow
├── curations/      # ClinGen curation management
└── users/          # User administration
```

## Tier 3: Frontend Layer (Vue 3 + Vite + Pinia)

### Core Responsibilities
- **User Interface**: Modern, responsive Vue 3 application
- **ClinGen Components**: Specialized evidence entry and scoring interfaces
- **Real-time Validation**: Client-side ClinGen compliance checking
- **State Management**: Pinia stores for API data management
- **Workflow UI**: Multi-stage curation process interface

### Key Features
- Vue 3 Composition API with TypeScript support
- Vite build system for fast development and production builds
- Pinia for predictable state management
- Vuetify Material Design components
- Real-time score calculation matching backend logic

### Component Architecture
```
src/
├── components/
│   ├── clingen/         # ClinGen-specific components
│   └── common/          # Reusable UI components
├── stores/              # Pinia state management
├── views/               # Page-level components
├── api/                 # API client layer
└── router/              # Vue Router configuration
```

## Data Flow Architecture

### Complete Workflow Data Flow
```
┌─────────────────┐
│ GENE REGISTRY   │ 
│ (HGNC Compliant)│
└────────┬────────┘
         │ Gene Selection
         ▼
┌─────────────────┐     ┌──────────────────────┐
│ PRE-CURATION    │────►│ LUMPING/SPLITTING    │
│ • MONDO ID      │     │ • Lump: Same entity  │
│ • Inheritance   │     │ • Split: Distinct    │
│ • Rationale     │     │ • Undecided: More    │
└────────┬────────┘     │   evidence needed    │
         │              └──────────────────────┘
         ▼
┌─────────────────┐
│ CURATION        │
│ • Evidence      │──┐
│   Collection    │  │   ┌────────────────────┐
│ • ClinGen       │  ├──►│ GENETIC EVIDENCE   │
│   Scoring       │  │   │ • Case-level (12)  │
│ • Summary Gen   │  │   │ • Segregation (3)  │
└────────┬────────┘  │   │ • Case-control (6) │
         │           │   └────────────────────┘
         ▼           │
┌─────────────────┐  │   ┌────────────────────┐
│ FINAL VERDICT   │  └──►│ EXPERIMENTAL       │
│ • Definitive    │      │ EVIDENCE (Max 6)   │
│ • Strong        │      │ • Function         │
│ • Moderate      │      │ • Models           │
│ • Limited       │      │ • Rescue           │
│ • No Known      │      └────────────────────┘
│ • Disputed      │
│ • Refuted       │
└─────────────────┘
```

## Technology Stack

### Current Implementation
- **Database**: PostgreSQL 15+ with ACID compliance and ClinGen schema support
- **Backend**: FastAPI + SQLAlchemy with automated ClinGen scoring engine
- **Frontend**: Vue 3.4.21 + Vite + Pinia with ClinGen-specific UI components
- **UI Framework**: Vuetify 3.9.3 (Material Design)
- **Authentication**: JWT + FastAPI Security with role-based access control
- **Build System**: Vite 5.2.8 (modern ESM-based builds)
- **State Management**: Pinia 2.1.7 with Composition API
- **Standards Compliance**: Automated ClinGen SOP v11 evidence scoring and summary generation

### Legacy Architecture (Pre-Migration)
- **Frontend**: Vue.js 3.2.13 with Vue CLI Service 5.0.0
- **Backend**: Firebase 10.7.1 (Firestore + Authentication)
- **Build**: Vue CLI (deprecated, migrated to Vite)

## Design Principles

### 1. ClinGen Standards as Database Constraints
Evidence scoring rules are implemented as database logic, ensuring consistent compliance across all application layers.

### 2. Hybrid Data Structure
Relational columns for core metrics with JSONB for detailed evidence, providing both structure and flexibility.

### 3. Immutable Provenance
Every record is content-addressable with SHA-256 hashes, enabling tamper-evident scientific collaboration.

### 4. API-First Design
Clear separation between data, business logic, and presentation layers with OpenAPI documentation.

## Deployment Architecture

### Development Environment
```bash
# Backend
make dev           # FastAPI with hot reload (:8000)

# Frontend  
make dev           # Vite dev server (:3000)

# Database
docker-compose up postgres  # PostgreSQL with seed data
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │  Application    │    │   Database      │
│   (nginx/ALB)   │◄──►│  (Docker)       │◄──►│  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Static Assets  │
                       │  (CDN/S3)       │
                       └─────────────────┘
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
- **Scalability**: Containerized deployment with horizontal scaling capability

## Security & Compliance

### Authentication & Authorization
- JWT tokens with stateless authentication
- Role-based access control (viewer/curator/admin)
- API key support for external integrations
- Session management with token blacklisting

### Data Integrity
- Content addressing with SHA-256 hashes
- Complete audit trail with user attribution
- Database constraints for ClinGen compliance
- Pydantic validation with custom validators

### Scientific Standards
- Immutable records with version chaining
- Complete evidence source attribution
- Automated ClinGen SOP v11 validation
- Multi-stage review and approval workflow

## Migration Strategy

The platform migrated from Firebase to PostgreSQL while preserving:
- **Configuration System**: Existing workflow configs enhanced with ClinGen features
- **User Experience**: Familiar interfaces with enhanced ClinGen capabilities
- **Data Integrity**: Complete migration with validation and backup procedures
- **Functionality**: All existing features plus new ClinGen compliance features

---

## Related Documentation

- [Database Schema](./DATABASE_SCHEMA.md) - Detailed PostgreSQL schema design
- [API Reference](./API_REFERENCE.md) - Complete FastAPI endpoint documentation
- [Frontend Guide](./FRONTEND_GUIDE.md) - Vue 3 components and state management
- [ClinGen Compliance](./CLINGEN_COMPLIANCE.md) - SOP v11 implementation details
- [Workflow Documentation](./WORKFLOW.md) - Complete curation process