# Current Firebase Implementation - Reference Documentation

This directory documents the current Firebase-based architecture that will be replaced by PostgreSQL + FastAPI in the refactor.

## Firebase Services Used

### Firestore Database
- **Collections**: `genes`, `precurations`, `curations`, `users`
- **Security Rules**: Role-based access control (admin, curator, viewer)
- **Real-time Updates**: Live data synchronization across clients
- **Composite Queries**: Limited querying capabilities

### Firebase Authentication
- **Email/Password**: Primary authentication method
- **Custom Claims**: Role assignment (admin, curator, viewer)
- **Session Management**: Automatic token refresh and validation
- **Route Guards**: Authentication state management

## Data Structure Overview

### Collection Schemas

#### genes/
```javascript
{
  id: "auto-generated-id",
  hgncId: "HGNC:12345",
  approvedSymbol: "PKD1",
  details: {
    // Configuration-driven flexible schema
    // Based on geneDetailsConfig.js
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  contributors: ["user1@email.com", "user2@email.com"]
}
```

#### precurations/
```javascript
{
  id: "auto-generated-id", 
  geneId: "reference-to-genes-collection",
  details: {
    // Configuration-driven schema
    // Based on precurationDetailsConfig.js
    mondoId: "MONDO:0001234",
    modeOfInheritance: "autosomal recessive",
    lumpingSplittingDecision: "Lump"
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  contributors: ["curator@email.com"]
}
```

#### curations/
```javascript
{
  id: "auto-generated-id",
  geneId: "reference-to-genes-collection", 
  precurationId: "reference-to-precurations-collection",
  details: {
    // Configuration-driven schema
    // Based on curationDetailsConfig.js
    // Contains evidence data, scores, summaries
    mondoId: "MONDO:0001234",
    modeOfInheritance: "autosomal recessive",
    // ... other fields defined in config
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  contributors: ["curator1@email.com", "curator2@email.com"]
}
```

#### users/
```javascript
{
  id: "firebase-auth-uid",
  email: "user@email.com",
  name: "User Name",
  role: "curator", // admin | curator | viewer
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Store Implementations

### Current Store Pattern
Located in `src/stores/`, each store follows this pattern:

```javascript
// Example: geneStore.js
import { auth, db } from '@/firebase'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'

export const geneStore = {
  // Get all genes
  async getGenes() {
    const querySnapshot = await getDocs(collection(db, 'genes'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  // Get single gene
  async getGene(geneId) {
    const docRef = doc(db, 'genes', geneId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  },

  // Create gene with validation
  async createGene(geneData, userId, config) {
    const validatedData = validateGeneData(geneData, config)
    const docRef = await addDoc(collection(db, 'genes'), {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
      contributors: [userId]
    })
    return docRef.id
  },

  // Update gene
  async updateGene(geneId, geneData, userId, config) {
    const validatedData = validateGeneData(geneData, config)
    const docRef = doc(db, 'genes', geneId)
    await updateDoc(docRef, {
      ...validatedData,
      updatedAt: new Date(),
      contributors: arrayUnion(userId)
    })
  },

  // Delete gene
  async deleteGene(geneId) {
    const docRef = doc(db, 'genes', geneId)
    await deleteDoc(docRef)
  }
}
```

### Store Files Reference
- `src/stores/geneStore.js` → Maps to genes/ collection
- `src/stores/precurationsStore.js` → Maps to precurations/ collection  
- `src/stores/curationsStore.js` → Maps to curations/ collection
- `src/stores/usersStore.js` → Maps to users/ collection
- `src/stores/AuthService.js` → Firebase Auth integration

## Firebase Configuration

### Connection Setup
```javascript
// src/firebase/index.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
```

### Security Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin'];
    }
    
    // Genes collection - role-based access
    match /genes/{geneId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'curator'];
    }
    
    // Similar rules for precurations and curations...
  }
}
```

## Authentication Flow

### User Registration/Login
1. Firebase Auth handles email/password authentication
2. Custom claims set user roles (admin, curator, viewer)
3. User document created in users/ collection
4. Route guards check authentication state

### Role-Based Access Control
```javascript
// src/stores/AuthService.js
export const AuthService = {
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const idTokenResult = await user.getIdTokenResult()
    return {
      uid: user.uid,
      email: user.email,
      role: idTokenResult.claims.role || 'viewer'
    }
  },

  async checkRole(requiredRole) {
    const user = auth.currentUser
    if (!user) return false
    
    const idTokenResult = await user.getIdTokenResult()
    const userRole = idTokenResult.claims.role
    
    const roleHierarchy = ['viewer', 'curator', 'admin']
    const userLevel = roleHierarchy.indexOf(userRole)
    const requiredLevel = roleHierarchy.indexOf(requiredRole)
    
    return userLevel >= requiredLevel
  }
}
```

## Configuration System Integration

### Workflow Configuration
The Firebase stores integrate with the configuration system in `src/config/workflows/`:

```javascript
// Example from curationsStore.js
import { curationDetailsConfig } from '@/config/workflows/KidneyGeneticsGeneCuration/curationDetailsConfig.js'

async function createCuration(curationData, userId) {
  // Validate against configuration
  const validatedData = validateAgainstConfig(curationData, curationDetailsConfig)
  
  // Create with timestamps and contributors
  const docRef = await addDoc(collection(db, 'curations'), {
    ...validatedData,
    createdAt: new Date(),
    updatedAt: new Date(), 
    contributors: [userId]
  })
  
  return docRef.id
}
```

## Key Limitations of Current Firebase Architecture

### Query Limitations
- No complex joins between collections
- Limited compound queries
- No full-text search capabilities
- Expensive reads for complex filtering

### Data Structure Constraints
- Document size limits (1MB)
- No enforced schema validation
- Limited transaction support across collections
- No computed/derived fields

### Scaling Concerns
- Read/write costs increase linearly
- No caching layer
- Limited offline capabilities
- Regional availability constraints

### ClinGen Compliance Gaps
- No automatic evidence scoring
- Manual summary generation
- No scientific provenance tracking
- Limited audit trail capabilities

## Migration Considerations

### Data Preservation
- All Firebase data must be exported before migration
- Document IDs should be mapped to PostgreSQL UUIDs
- Timestamps need timezone-aware conversion
- Array fields (contributors) need normalization

### Configuration Compatibility
- Existing workflow configs must remain functional
- Field mappings need to be preserved
- Validation rules should be enhanced, not replaced
- UI rendering logic should continue working

### User Migration
- Firebase Auth UIDs map to PostgreSQL user IDs
- Custom claims (roles) become database enum values
- Email/password auth transitions to JWT tokens
- Session management moves to API layer

## Reference Files

### Key Firebase Integration Files
- `src/firebase/index.js` - Firebase initialization
- `src/stores/*.js` - All store implementations
- `src/router/index.js` - Route guards with Firebase Auth
- `src/components/*/` - Components with direct Firebase calls

### Configuration Files
- `src/config/workflows/KidneyGeneticsGeneCuration/*` - Must be preserved
- `src/config/appConfig.json` - App-level configuration
- `src/config/userRolesConfig.js` - Role definitions

### Authentication Components
- `src/views/LoginUser.vue` - Firebase Auth login
- `src/views/RegisterUser.vue` - User registration
- `src/components/AppBar.vue` - Auth state display

This Firebase implementation has served the project well but lacks the scientific rigor and performance needed for the ClinGen-compliant future state. The PostgreSQL + FastAPI architecture will address all identified limitations while preserving the successful configuration-driven workflow system.