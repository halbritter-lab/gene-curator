# Gene Curator - API Reference

## Overview

Gene Curator provides comprehensive RESTful API endpoints built with FastAPI. This document details all available endpoints, request/response schemas, authentication requirements, and integration examples.

## Base URL and Versioning

**Production**: `https://gene-curator.org/api/v1`  
**Development**: `http://localhost:8000/api/v1`

All API endpoints are versioned and follow RESTful conventions with automatic OpenAPI/Swagger documentation available at `/docs`.

## Authentication

### JWT Token Authentication

All protected endpoints require Bearer token authentication:

```http
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body**:
```json
{
  "email": "curator@example.org",
  "password": "SecurePassword123!",
  "name": "Dr. Jane Curator",
  "role": "curator"
}
```

**Response** (201 Created):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "curator@example.org",
  "name": "Dr. Jane Curator",
  "role": "curator",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### POST /auth/login
Authenticate and receive JWT tokens.

**Request Body**:
```json
{
  "email": "curator@example.org",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "curator@example.org",
    "name": "Dr. Jane Curator",
    "role": "curator"
  }
}
```

#### POST /auth/refresh
Refresh expired access token.

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### GET /auth/me
Get current user information.

**Response** (200 OK):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "curator@example.org",
  "name": "Dr. Jane Curator",
  "role": "curator",
  "is_active": true,
  "last_login": "2024-01-15T10:30:00Z",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Gene Management Endpoints

### GET /genes
List genes with pagination and filtering.

**Query Parameters**:
- `skip` (int, default=0): Number of records to skip
- `limit` (int, default=50, max=500): Number of records to return
- `search` (string): Search term for gene symbol or HGNC ID
- `chromosome` (string): Filter by chromosome
- `sort_by` (string, default="approved_symbol"): Field to sort by
- `sort_order` (string, default="asc"): Sort order (asc/desc)

**Response** (200 OK):
```json
{
  "genes": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "hgnc_id": "HGNC:12345",
      "approved_symbol": "BRCA1",
      "chromosome": "17",
      "location": "17q21.31",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 50,
  "has_next": false,
  "has_prev": false
}
```

### POST /genes
Create a new gene entry.

**Request Body**:
```json
{
  "hgnc_id": "HGNC:67890",
  "approved_symbol": "PKD1",
  "chromosome": "16",
  "location": "16p13.3",
  "details": {
    "gene_type": "protein_coding",
    "aliases": ["PC1", "APKD1"],
    "function": "Encodes polycystin-1 protein"
  }
}
```

**Response** (201 Created):
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "hgnc_id": "HGNC:67890",
  "approved_symbol": "PKD1",
  "chromosome": "16",
  "location": "16p13.3",
  "record_hash": "a1b2c3d4e5f6789...",
  "details": {
    "gene_type": "protein_coding",
    "aliases": ["PC1", "APKD1"],
    "function": "Encodes polycystin-1 protein"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "created_by": "123e4567-e89b-12d3-a456-426614174000"
}
```

### GET /genes/{gene_id}
Get detailed gene information.

**Response** (200 OK):
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "hgnc_id": "HGNC:67890",
  "approved_symbol": "PKD1",
  "previous_symbols": ["PKD"],
  "alias_symbols": ["PC1", "APKD1"],
  "chromosome": "16",
  "location": "16p13.3",
  "record_hash": "a1b2c3d4e5f6789...",
  "details": {
    "gene_type": "protein_coding",
    "function": "Encodes polycystin-1 protein",
    "constraint_metrics": {
      "pLI": 0.999,
      "oe_lof": 0.04
    }
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "created_by": "123e4567-e89b-12d3-a456-426614174000",
  "creator": {
    "name": "Dr. Jane Curator",
    "email": "curator@example.org"
  }
}
```

### GET /genes/summary
Get minimal gene information for dropdowns and selection lists.

**Response** (200 OK):
```json
[
  {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "hgnc_id": "HGNC:67890",
    "approved_symbol": "PKD1",
    "chromosome": "16"
  }
]
```

## Pre-curation Endpoints

### GET /precurations
List pre-curations with filtering and pagination.

**Query Parameters**:
- `skip`, `limit`: Pagination controls
- `gene_id` (UUID): Filter by gene
- `mondo_id` (string): Filter by disease
- `status` (enum): Filter by workflow status
- `decision` (enum): Filter by lumping/splitting decision

**Response** (200 OK):
```json
{
  "precurations": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174002",
      "gene_id": "456e7890-e89b-12d3-a456-426614174001",
      "mondo_id": "MONDO:0002113",
      "mode_of_inheritance": "Autosomal Dominant",
      "lumping_splitting_decision": "Lump",
      "status": "Approved",
      "created_at": "2024-01-15T10:30:00Z",
      "gene": {
        "approved_symbol": "PKD1",
        "hgnc_id": "HGNC:67890"
      }
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 50
}
```

### POST /precurations
Create a new pre-curation.

**Request Body**:
```json
{
  "gene_id": "456e7890-e89b-12d3-a456-426614174001",
  "mondo_id": "MONDO:0002113",
  "mode_of_inheritance": "Autosomal Dominant",
  "lumping_splitting_decision": "Lump",
  "rationale": "PKD1 variants cause a spectrum of polycystic kidney disease manifestations that represent a single genetic entity with variable expressivity rather than distinct conditions. The underlying mechanism involves loss of polycystin-1 function leading to disrupted cellular signaling.",
  "status": "Draft",
  "details": {
    "phenotype_spectrum": "Polycystic kidney disease with variable age of onset",
    "supporting_literature": ["12345678", "87654321"],
    "confidence_level": "High"
  }
}
```

**Response** (201 Created):
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "gene_id": "456e7890-e89b-12d3-a456-426614174001",
  "mondo_id": "MONDO:0002113",
  "mode_of_inheritance": "Autosomal Dominant",
  "lumping_splitting_decision": "Lump",
  "rationale": "PKD1 variants cause a spectrum of polycystic kidney disease...",
  "status": "Draft",
  "record_hash": "x1y2z3a4b5c6789...",
  "details": {
    "phenotype_spectrum": "Polycystic kidney disease with variable age of onset",
    "supporting_literature": ["12345678", "87654321"],
    "confidence_level": "High"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "created_by": "123e4567-e89b-12d3-a456-426614174000"
}
```

### POST /precurations/{precuration_id}/submit
Submit pre-curation for review.

**Response** (200 OK):
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "status": "In_Primary_Review",
  "submitted_at": "2024-01-15T10:35:00Z",
  "message": "Pre-curation submitted for review"
}
```

## Curation Endpoints (ClinGen Core)

### GET /curations
List curations with ClinGen-specific filtering.

**Query Parameters**:
- Standard pagination: `skip`, `limit`
- `gene_id` (UUID): Filter by gene
- `mondo_id` (string): Filter by disease
- `verdict` (enum): Filter by ClinGen classification
- `status` (enum): Filter by workflow status
- `gcep_affiliation` (string): Filter by expert panel
- `min_total_score` (float): Minimum evidence score
- `max_total_score` (float): Maximum evidence score
- `has_contradictory_evidence` (boolean): Filter by contradictory evidence

**Response** (200 OK):
```json
{
  "curations": [
    {
      "id": "abc1234-e89b-12d3-a456-426614174003",
      "gene_id": "456e7890-e89b-12d3-a456-426614174001",
      "mondo_id": "MONDO:0002113",
      "disease_name": "Polycystic kidney disease 1",
      "verdict": "Definitive",
      "genetic_evidence_score": 12.0,
      "experimental_evidence_score": 4.5,
      "total_score": 16.5,
      "has_contradictory_evidence": false,
      "gcep_affiliation": "Kidney Disease GCEP",
      "status": "Published",
      "approved_at": "2024-01-10T15:00:00Z",
      "published_at": "2024-01-12T09:00:00Z",
      "created_at": "2024-01-05T10:30:00Z",
      "gene": {
        "approved_symbol": "PKD1",
        "hgnc_id": "HGNC:67890"
      }
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 50
}
```

### POST /curations
Create a new curation with automatic ClinGen scoring.

**Request Body**:
```json
{
  "gene_id": "456e7890-e89b-12d3-a456-426614174001",
  "precuration_id": "789e0123-e89b-12d3-a456-426614174002",
  "mondo_id": "MONDO:0002113",
  "mode_of_inheritance": "Autosomal Dominant",
  "disease_name": "Polycystic kidney disease 1",
  "verdict": "Definitive",
  "gcep_affiliation": "Kidney Disease GCEP",
  "details": {
    "genetic_evidence": {
      "case_level_data": [
        {
          "pmid": "12345678",
          "proband_label": "Smith et al, Family 1",
          "variant_type": "Predicted or Proven Null",
          "is_de_novo": false,
          "functional_evidence": "Protein truncation confirmed by Western blot",
          "points": 1.5,
          "rationale": "Truncating variant with functional validation"
        }
      ],
      "segregation_data": [
        {
          "pmid": "87654321",
          "family_label": "Large family study",
          "lod_score_published": 4.2,
          "points": 2.0,
          "rationale": "LOD score exceeds 3.0 threshold"
        }
      ]
    },
    "experimental_evidence": {
      "models": [
        {
          "type": "Non-human model organism",
          "pmid": "11223344",
          "organism": "Mus musculus",
          "description": "Pkd1 knockout mice develop polycystic kidneys",
          "points": 2.0,
          "rationale": "Mouse model recapitulates human disease"
        }
      ]
    }
  }
}
```

**Response** (201 Created):
```json
{
  "id": "abc1234-e89b-12d3-a456-426614174003",
  "gene_id": "456e7890-e89b-12d3-a456-426614174001",
  "precuration_id": "789e0123-e89b-12d3-a456-426614174002",
  "mondo_id": "MONDO:0002113",
  "mode_of_inheritance": "Autosomal Dominant",
  "disease_name": "Polycystic kidney disease 1",
  "verdict": "Definitive",
  "genetic_evidence_score": 3.5,
  "experimental_evidence_score": 2.0,
  "total_score": 5.5,
  "has_contradictory_evidence": false,
  "gcep_affiliation": "Kidney Disease GCEP",
  "status": "Draft",
  "record_hash": "p1q2r3s4t5u6789...",
  "details": {
    "genetic_evidence": {
      "case_level_data": [...],
      "segregation_data": [...]
    },
    "experimental_evidence": {
      "models": [...]
    }
  },
  "created_at": "2024-01-15T10:30:00Z",
  "created_by": "123e4567-e89b-12d3-a456-426614174000"
}
```

### GET /curations/{curation_id}
Get complete curation details with full evidence.

**Response** (200 OK):
```json
{
  "id": "abc1234-e89b-12d3-a456-426614174003",
  "gene_id": "456e7890-e89b-12d3-a456-426614174001",
  "precuration_id": "789e0123-e89b-12d3-a456-426614174002",
  "mondo_id": "MONDO:0002113",
  "mode_of_inheritance": "Autosomal Dominant",
  "disease_name": "Polycystic kidney disease 1",
  "verdict": "Definitive",
  "genetic_evidence_score": 12.0,
  "experimental_evidence_score": 4.5,
  "total_score": 16.5,
  "has_contradictory_evidence": false,
  "summary_text": "PKD1 AND Polycystic kidney disease 1\n\nEXPERT PANEL: Kidney Disease GCEP...",
  "gcep_affiliation": "Kidney Disease GCEP",
  "sop_version": "v11",
  "status": "Published",
  "approved_at": "2024-01-10T15:00:00Z",
  "approved_by": "admin123-e89b-12d3-a456-426614174004",
  "published_at": "2024-01-12T09:00:00Z",
  "record_hash": "p1q2r3s4t5u6789...",
  "previous_hash": null,
  "details": {
    "genetic_evidence": {
      "case_level_data": [
        {
          "pmid": "12345678",
          "proband_label": "Smith et al, Family 1",
          "hpo_terms": ["HP:0000107", "HP:0000108"],
          "variant_type": "Predicted or Proven Null",
          "is_de_novo": false,
          "functional_evidence": "Protein truncation confirmed",
          "points": 1.5,
          "rationale": "Truncating variant with functional validation"
        }
      ],
      "segregation_data": [
        {
          "pmid": "87654321",
          "family_label": "Large family study",
          "sequencing_method": "Exome sequencing",
          "lod_score_published": 4.2,
          "points": 2.0,
          "rationale": "LOD score exceeds 3.0 threshold"
        }
      ]
    },
    "experimental_evidence": {
      "models": [
        {
          "type": "Non-human model organism",
          "pmid": "11223344",
          "organism": "Mus musculus",
          "description": "Pkd1 knockout mice develop polycystic kidneys",
          "phenotype_match": "Excellent",
          "points": 2.0,
          "rationale": "Mouse model recapitulates human disease"
        }
      ]
    },
    "curation_workflow": {
      "status": "Published",
      "review_log": [
        {
          "timestamp": "2024-01-05T10:30:00Z",
          "action": "created",
          "user": "curator@example.org",
          "comment": "Initial curation created"
        },
        {
          "timestamp": "2024-01-10T15:00:00Z",
          "action": "approved",
          "user": "admin@example.org",
          "comment": "Approved for publication"
        }
      ]
    }
  },
  "created_at": "2024-01-05T10:30:00Z",
  "updated_at": "2024-01-10T15:00:00Z",
  "created_by": "123e4567-e89b-12d3-a456-426614174000",
  "gene": {
    "approved_symbol": "PKD1",
    "hgnc_id": "HGNC:67890",
    "current_dyadic_name": "PKD1-associated polycystic kidney disease"
  },
  "precuration": {
    "lumping_splitting_decision": "Lump",
    "rationale": "Single genetic entity with variable expressivity"
  },
  "creator": {
    "name": "Dr. Jane Curator",
    "email": "curator@example.org"
  },
  "approver": {
    "name": "Dr. Admin User",
    "email": "admin@example.org"
  }
}
```

### POST /curations/{curation_id}/calculate-scores
Recalculate ClinGen evidence scores.

**Response** (200 OK):
```json
{
  "genetic_evidence_score": 12.0,
  "experimental_evidence_score": 4.5,
  "total_score": 16.5,
  "verdict": "Definitive",
  "has_contradictory_evidence": false,
  "evidence_breakdown": {
    "case_level_points": 10.5,
    "segregation_points": 3.0,
    "case_control_points": 0.0,
    "function_points": 1.5,
    "model_points": 2.0,
    "rescue_points": 1.0
  },
  "classification_rationale": "Total score of 16.5 points with no contradictory evidence supports Definitive classification"
}
```

### GET /curations/{curation_id}/summary
Generate ClinGen evidence summary.

**Response** (200 OK):
```json
{
  "summary_text": "PKD1 AND Polycystic kidney disease 1\n\nEXPERT PANEL: Kidney Disease GCEP\nGENE-DISEASE RELATIONSHIP: Definitive\nMOI: Autosomal Dominant\nSOP: v11\n\nGENETIC EVIDENCE (12.0 points):\nCase-level evidence includes 8 probands with qualifying variants (10.5 points). Segregation evidence from 2 studies (3.0 points).\n\nEXPERIMENTAL EVIDENCE (4.5 points):\nFunctional evidence demonstrates loss of polycystin-1 function (1.5 points). Model organism studies in mice recapitulate disease phenotype (2.0 points). Rescue evidence from gene therapy studies (1.0 points).\n\nTOTAL SCORE: 16.5 points\nCLASSIFICATION: Definitive",
  "template_version": "v5.1",
  "generated_at": "2024-01-15T10:45:00Z"
}
```

### POST /curations/{curation_id}/approve
Approve curation (Admin only).

**Request Body**:
```json
{
  "comment": "Excellent evidence quality, ready for publication"
}
```

**Response** (200 OK):
```json
{
  "id": "abc1234-e89b-12d3-a456-426614174003",
  "status": "Approved",
  "approved_at": "2024-01-15T10:50:00Z",
  "approved_by": "admin123-e89b-12d3-a456-426614174004",
  "message": "Curation approved successfully"
}
```

### POST /curations/{curation_id}/publish
Publish approved curation (Admin only).

**Response** (200 OK):
```json
{
  "id": "abc1234-e89b-12d3-a456-426614174003",
  "status": "Published",
  "published_at": "2024-01-15T10:55:00Z",
  "gencc_submission_id": "GENCC_12345",
  "message": "Curation published and submitted to GenCC"
}
```

## User Management Endpoints

### GET /users
List users (Admin only).

**Query Parameters**:
- `skip`, `limit`: Pagination
- `role` (enum): Filter by user role
- `is_active` (boolean): Filter by active status

**Response** (200 OK):
```json
{
  "users": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "curator@example.org",
      "name": "Dr. Jane Curator",
      "role": "curator",
      "is_active": true,
      "last_login": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 50
}
```

### PUT /users/{user_id}
Update user information (Admin only).

**Request Body**:
```json
{
  "name": "Dr. Jane Senior Curator",
  "role": "admin",
  "is_active": true
}
```

## Statistics and Analytics

### GET /statistics/overview
Get overall platform statistics.

**Response** (200 OK):
```json
{
  "total_genes": 1250,
  "total_precurations": 850,
  "total_curations": 420,
  "published_curations": 380,
  "active_users": 45,
  "curations_by_verdict": {
    "Definitive": 150,
    "Strong": 120,
    "Moderate": 85,
    "Limited": 45,
    "No Known Disease Relationship": 15,
    "Disputed": 5
  },
  "curations_by_gcep": {
    "Cardiovascular GCEP": 95,
    "Kidney Disease GCEP": 78,
    "Hearing Loss GCEP": 62,
    "Neurological GCEP": 145
  },
  "avg_evidence_scores": {
    "genetic_evidence": 8.5,
    "experimental_evidence": 3.2,
    "total_score": 11.7
  }
}
```

### GET /statistics/clingen
Get ClinGen-specific compliance statistics.

**Response** (200 OK):
```json
{
  "sop_compliance_rate": 98.5,
  "avg_review_time_days": 12.3,
  "evidence_quality_metrics": {
    "pmid_validation_rate": 99.2,
    "evidence_completeness": 94.8,
    "citation_accuracy": 97.1
  },
  "classification_distribution": {
    "high_confidence": 270,
    "medium_confidence": 85,
    "low_confidence": 45,
    "disputed": 5
  },
  "monthly_publication_rate": 28.5
}
```

## Error Responses

### Standard Error Format
```json
{
  "detail": "Error description",
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req_123456789"
}
```

### Common HTTP Status Codes
- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Validation Error Details
```json
{
  "detail": [
    {
      "loc": ["body", "mondo_id"],
      "msg": "MONDO ID must be in format MONDO:#### where #### is a number",
      "type": "value_error",
      "ctx": {"pattern": "^MONDO:[0-9]+$"}
    }
  ],
  "error_code": "VALIDATION_ERROR"
}
```

## Rate Limiting

**Limits**:
- Authenticated users: 1000 requests/hour
- Unauthenticated users: 100 requests/hour
- Admin users: 5000 requests/hour

**Headers**:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1642248000
```

## Pagination

**Standard Parameters**:
- `skip` (int): Number of records to skip (default: 0)
- `limit` (int): Number of records to return (default: 50, max: 500)

**Response Format**:
```json
{
  "items": [...],
  "total": 1250,
  "skip": 0,
  "limit": 50,
  "has_next": true,
  "has_prev": false
}
```

## OpenAPI Documentation

Interactive API documentation is available at:
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI JSON**: `/openapi.json`

## SDK Examples

### Python Client Example
```python
import httpx
from typing import Optional

class GeneCuratorClient:
    def __init__(self, base_url: str, token: Optional[str] = None):
        self.base_url = base_url
        self.client = httpx.Client()
        if token:
            self.client.headers.update({"Authorization": f"Bearer {token}"})
    
    async def login(self, email: str, password: str) -> dict:
        response = await self.client.post(
            f"{self.base_url}/auth/login",
            json={"email": email, "password": password}
        )
        response.raise_for_status()
        data = response.json()
        self.client.headers.update({"Authorization": f"Bearer {data['access_token']}"})
        return data
    
    async def create_curation(self, curation_data: dict) -> dict:
        response = await self.client.post(
            f"{self.base_url}/curations",
            json=curation_data
        )
        response.raise_for_status()
        return response.json()
    
    async def get_curation(self, curation_id: str) -> dict:
        response = await self.client.get(
            f"{self.base_url}/curations/{curation_id}"
        )
        response.raise_for_status()
        return response.json()

# Usage
client = GeneCuratorClient("https://gene-curator.org/api/v1")
await client.login("curator@example.org", "password")
curation = await client.get_curation("abc1234-e89b-12d3-a456-426614174003")
```

### JavaScript Client Example
```javascript
class GeneCuratorAPI {
  constructor(baseURL, token = null) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.token = data.access_token;
    return data;
  }

  async getCurations(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/curations?${queryString}`);
  }

  async createCuration(curationData) {
    return this.request('/curations', {
      method: 'POST',
      body: JSON.stringify(curationData)
    });
  }
}

// Usage
const api = new GeneCuratorAPI('https://gene-curator.org/api/v1');
await api.login('curator@example.org', 'password');
const curations = await api.getCurations({ verdict: 'Definitive', limit: 10 });
```

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - Overall system design
- [Database Schema](./DATABASE_SCHEMA.md) - Database structure and relationships
- [ClinGen Compliance](./CLINGEN_COMPLIANCE.md) - SOP v11 implementation details
- [Frontend Guide](./FRONTEND_GUIDE.md) - UI component integration
- [Workflow Documentation](./WORKFLOW.md) - Business process flows