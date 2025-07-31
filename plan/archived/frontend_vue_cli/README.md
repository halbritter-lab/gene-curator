# Current Vue CLI Frontend Implementation - Reference Documentation

This directory documents the current Vue CLI + Vue 2/3 frontend architecture that will be migrated to Vite + Vue 3 with enhanced ClinGen components.

## Technology Stack Overview

### Core Technologies
- **Vue.js**: 3.2.13 with Composition API (partially adopted)
- **Vue CLI**: 5.0.0 for build system and development server
- **Vuetify**: 3.4.8 for Material Design components
- **Vue Router**: 4.2.5 for client-side routing
- **JavaScript**: ES2015+ with some TypeScript adoption

### Build & Development
- **Webpack**: Via Vue CLI for bundling and asset processing
- **Babel**: ES6+ transpilation with Vue CLI preset
- **ESLint**: Code quality and consistency checking
- **Development Server**: Vue CLI dev server with hot reload

## Project Structure Analysis

### Component Architecture

#### Core Layout Components
```
src/components/
├── AppBar.vue              # Top navigation with user auth state
├── FooterBar.vue           # Footer with app information
├── MessageSnackbar.vue     # Global notification system
├── LoadingDialog.vue       # Loading state management
└── ConfirmationModal.vue   # Generic confirmation dialogs
```

#### Data Management Components
```
src/components/
├── DataDisplayTable.vue    # Flexible table component for all data views
├── DataExport.vue         # CSV import/export functionality
├── HelpIcon.vue           # Context-sensitive help system
├── HelpDialog.vue         # Help content display
└── StaticContent.vue      # Configuration-driven content display
```

#### Workflow-Specific Components
```
src/components/
├── GeneDetailCard.vue           # Gene information display
├── GeneLinkChips.vue           # External gene database links
├── GeneCurationStatusChips.vue  # Curation status visualization
├── PrecurationForm.vue         # Precuration workflow form
├── CurationForm.vue            # Main curation form
└── CurationModal.vue           # Modal-based curation editing
```

### View Components (Pages)

#### Primary Workflow Views
```
src/views/
├── HomePage.vue           # Landing page with overview
├── GenesTable.vue         # Gene management and browsing
├── GeneDetail.vue         # Individual gene detail page
├── PreCurationTable.vue   # Precuration workflow management
├── CurationTable.vue      # Main curation interface
└── GeneAdmin.vue          # Administrative gene management
```

#### User Management Views
```
src/views/
├── LoginUser.vue          # Firebase Auth login
├── RegisterUser.vue       # User registration
├── UserPage.vue           # User profile and settings
├── UserAdminView.vue      # User administration
└── NotAuthorized.vue      # Access denied page
```

#### Information Views
```
src/views/
├── About.vue              # About page with app information
├── FAQ.vue                # Frequently asked questions
└── PageNotFound.vue       # 404 error page
```

## Configuration-Driven Architecture

### Workflow Configuration System
The frontend's strength lies in its configuration-driven approach:

```javascript
// src/config/workflows/KidneyGeneticsGeneCuration/
├── workflowConfig.js           # Overall workflow orchestration
├── geneDetailsConfig.js        # Gene data field definitions
├── precurationDetailsConfig.js # Precuration form configuration
├── curationDetailsConfig.js    # Main curation form configuration
└── static/
    ├── geneHelp.json          # Help content for gene fields
    ├── precurationHelp.json   # Help content for precuration
    └── curationHelp.json      # Help content for curation
```

### Field Configuration Structure
```javascript
// Example from curationDetailsConfig.js
export const curationDetailsConfig = [
  {
    key: 'mondoId',
    label: 'MONDO ID',
    format: 'text',
    required: true,
    tableView: true,
    standardView: true,
    curationView: true,
    group: 'Disease Information',
    order: 1,
    style: 'text-field',
    validation: {
      pattern: /^MONDO:\d+$/,
      message: 'Must be valid MONDO ID format'
    }
  },
  {
    key: 'modeOfInheritance',
    label: 'Mode of Inheritance',
    format: 'text',
    required: true,
    tableView: true,
    standardView: true,
    curationView: true,
    group: 'Disease Information',
    order: 2,
    style: 'select',
    options: [
      'autosomal recessive',
      'autosomal dominant',
      'X-linked recessive',
      'X-linked dominant'
    ]
  }
  // ... more field configurations
]
```

### Dynamic Form Rendering
Components like `CurationForm.vue` and `PrecurationForm.vue` dynamically render forms based on configuration:

```vue
<!-- CurationForm.vue excerpt -->
<template>
  <v-form ref="form" v-model="valid">
    <div v-for="group in groupedFields" :key="group.name">
      <v-subheader>{{ group.name }}</v-subheader>
      
      <div v-for="field in group.fields" :key="field.key">
        <!-- Text Field -->
        <v-text-field
          v-if="field.style === 'text-field'"
          v-model="formData[field.key]"
          :label="field.label"
          :required="field.required"
          :rules="getValidationRules(field)"
        />
        
        <!-- Select Field -->
        <v-select
          v-else-if="field.style === 'select'"
          v-model="formData[field.key]"
          :items="field.options"
          :label="field.label"
          :required="field.required"
        />
        
        <!-- Textarea -->
        <v-textarea
          v-else-if="field.style === 'textarea'"
          v-model="formData[field.key]"
          :label="field.label"
          :rows="field.rows || 3"
        />
        
        <!-- Help Icon -->
        <HelpIcon
          v-if="field.help"
          :content="field.help"
          :field-key="field.key"
        />
      </div>
    </div>
  </v-form>
</template>

<script>
import { curationDetailsConfig } from '@/config/workflows/KidneyGeneticsGeneCuration/curationDetailsConfig.js'

export default {
  name: 'CurationForm',
  data() {
    return {
      formData: {},
      valid: false
    }
  },
  computed: {
    groupedFields() {
      return this.groupFieldsByCategory(curationDetailsConfig)
    }
  },
  methods: {
    groupFieldsByCategory(fields) {
      const groups = {}
      fields.forEach(field => {
        const groupName = field.group || 'General'
        if (!groups[groupName]) {
          groups[groupName] = { name: groupName, fields: [] }
        }
        groups[groupName].fields.push(field)
      })
      
      // Sort fields within groups by order
      Object.values(groups).forEach(group => {
        group.fields.sort((a, b) => (a.order || 0) - (b.order || 0))
      })
      
      return Object.values(groups)
    },
    
    getValidationRules(field) {
      const rules = []
      
      if (field.required) {
        rules.push(v => !!v || `${field.label} is required`)
      }
      
      if (field.validation) {
        if (field.validation.pattern) {
          rules.push(v => !v || field.validation.pattern.test(v) || field.validation.message)
        }
      }
      
      return rules
    }
  }
}
</script>
```

## State Management Pattern

### Direct Firebase Integration
Current components directly access Firebase through store functions:

```vue
<!-- GenesTable.vue excerpt -->
<script>
import { geneStore } from '@/stores/geneStore.js'
import { AuthService } from '@/stores/AuthService.js'

export default {
  name: 'GenesTable',
  data() {
    return {
      genes: [],
      loading: false,
      user: null
    }
  },
  async created() {
    this.user = await AuthService.getCurrentUser()
    await this.loadGenes()
  },
  methods: {
    async loadGenes() {
      this.loading = true
      try {
        this.genes = await geneStore.getGenes()
      } catch (error) {
        console.error('Error loading genes:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createGene(geneData) {
      try {
        const geneId = await geneStore.createGene(
          geneData, 
          this.user.uid, 
          geneDetailsConfig
        )
        await this.loadGenes() // Refresh data
      } catch (error) {
        console.error('Error creating gene:', error)
      }
    }
  }
}
</script>
```

## Routing and Authentication

### Route Configuration
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { AuthService } from '@/stores/AuthService.js'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/genes',
    name: 'GenesTable', 
    component: () => import('@/views/GenesTable.vue'),
    meta: { requiresAuth: true, role: 'viewer' }
  },
  {
    path: '/curations',
    name: 'CurationTable',
    component: () => import('@/views/CurationTable.vue'),
    meta: { requiresAuth: true, role: 'curator' }
  },
  {
    path: '/admin/users',
    name: 'UserAdminView',
    component: () => import('@/views/UserAdminView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Route guards for authentication and authorization
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRole = to.meta.role
  
  if (requiresAuth) {
    const user = await AuthService.getCurrentUser()
    
    if (!user) {
      next('/login')
      return
    }
    
    if (requiredRole && !(await AuthService.checkRole(requiredRole))) {
      next('/not-authorized')
      return
    }
  }
  
  next()
})
```

## Component Communication Patterns

### Props and Events
Standard Vue parent-child communication:

```vue
<!-- Parent: CurationTable.vue -->
<template>
  <div>
    <DataDisplayTable
      :items="curations"
      :headers="tableHeaders"
      :loading="loading"
      @edit="editCuration"
      @delete="deleteCuration"
    />
    
    <CurationModal
      v-model="showModal"
      :curation="selectedCuration"
      @save="saveCuration"
      @cancel="closeModal"
    />
  </div>
</template>
```

### Global Event Bus (Limited Use)
Some components use a global event bus for cross-component communication:

```javascript
// Limited usage in current implementation
import { createApp } from 'vue'
const app = createApp({})
const eventBus = app.config.globalProperties.$eventBus = {}

// Usage in components
this.$eventBus.$emit('curation-updated', curationData)
this.$eventBus.$on('curation-updated', this.handleCurationUpdate)
```

## Styling and Theme

### Vuetify Integration
Heavy reliance on Vuetify components and Material Design:

```vue
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Gene Information</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Gene Symbol"
                prepend-icon="mdi-dna"
              />
              <v-select
                :items="inheritanceOptions"
                label="Mode of Inheritance"
                prepend-icon="mdi-family-tree"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Save</v-btn>
            <v-btn color="secondary">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
```

### Custom Styling
Minimal custom CSS, mostly relying on Vuetify's theme system:

```javascript
// vuetify configuration in main.js
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
  }
})
```

## Build Configuration

### Vue CLI Configuration
```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/gene-curator/' : '/',
  
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    }
  },
  
  chainWebpack: (config) => {
    config.plugin('define').tap((args) => {
      args[0]['process.env'] = JSON.stringify(process.env)
      return args
    })
  }
})
```

### Package Dependencies
```json
{
  "dependencies": {
    "vue": "^3.2.13",
    "vue-router": "^4.2.5",
    "vuetify": "^3.4.8",
    "firebase": "^10.7.1",
    "@mdi/font": "^7.0.96",
    "core-js": "^3.8.3"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "~5.0.0",
    "@vue/cli-plugin-eslint": "~5.0.0",
    "@vue/cli-plugin-router": "~5.0.0",
    "@vue/cli-service": "~5.0.0",
    "eslint": "^7.32.0",
    "eslint-plugin-vue": "^8.0.3"
  }
}
```

## Key Strengths of Current Architecture

### Configuration-Driven Flexibility
- Dynamic form generation based on field configurations
- Easy addition of new workflow steps
- Consistent validation and display rules
- Maintainable and extensible field definitions

### Component Reusability
- `DataDisplayTable` handles all table views consistently
- `HelpIcon` provides contextual help throughout the app
- Modal-based editing with consistent UX patterns
- Standardized form field rendering

### User Experience
- Responsive design with Vuetify
- Consistent Material Design language
- Intuitive navigation and workflow progression
- Comprehensive help system

## Limitations and Areas for Improvement

### Performance Issues
- No code splitting or lazy loading
- Large bundle sizes with Vuetify
- Direct Firebase calls causing unnecessary re-renders
- No caching layer for frequently accessed data

### State Management
- No centralized state management (Vuex/Pinia)
- Component-level data fetching leads to inconsistencies
- Props drilling for shared state
- Difficult to track data flow and updates

### TypeScript Adoption
- Limited TypeScript usage
- No API contract validation
- Runtime errors from type mismatches
- Poor IDE support for auto-completion

### Testing Coverage
- No unit tests for components
- No integration tests for workflows
- No end-to-end testing
- Manual testing only

### ClinGen Integration Gaps
- No specialized evidence entry components
- Manual scoring calculations
- No real-time score feedback
- Limited scientific workflow support

## Migration Strategy Considerations

### Preserve Configuration System
The configuration-driven architecture is a major strength that must be preserved:
- Field definitions should remain in configuration files
- Dynamic rendering logic should be enhanced, not replaced
- Help system integration should be maintained
- Validation rules should be preserved and enhanced

### Component Enhancement Strategy
- `DataDisplayTable` → Enhanced with ClinGen-specific columns and actions
- Form components → Add real-time scoring and validation
- Modal patterns → Preserve but enhance with better state management
- Navigation → Enhance with workflow progress indicators

### Gradual Migration Approach
1. **Foundation**: Migrate build system (Vue CLI → Vite)
2. **State**: Introduce Pinia for centralized state management
3. **Components**: Enhance existing components with Composition API
4. **ClinGen**: Add specialized evidence entry components
5. **Integration**: Connect to new FastAPI backend
6. **Enhancement**: Add performance optimizations and testing

The current Vue CLI architecture has served the project well and established excellent patterns for configuration-driven workflows. The migration to Vite + enhanced Vue 3 will build upon these strengths while addressing performance and scientific workflow requirements.