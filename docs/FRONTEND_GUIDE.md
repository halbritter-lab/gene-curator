# Gene Curator - Frontend Development Guide

## Overview

Gene Curator's frontend is built with Vue 3, Vite, and Pinia, featuring specialized ClinGen components for evidence-based gene curation. This guide covers the component architecture, state management, user workflows, and development patterns.

## Technology Stack

### Core Technologies
- **Vue 3.4.21**: Composition API with `<script setup>` syntax
- **Vite 5.2.8**: Fast development server and build tool
- **Pinia 2.1.7**: State management with Composition API
- **Vuetify 3.9.3**: Material Design component library
- **TypeScript**: Type safety and enhanced developer experience
- **Vue Router**: Client-side routing with authentication guards

### Build and Development
- **ESLint + Prettier**: Code formatting and linting
- **Vite HMR**: Hot module replacement for fast development
- **Component Testing**: Vitest for unit and component tests
- **Bundle Analysis**: Built-in bundle analyzer for optimization

## Project Structure

```
frontend/src/
├── components/
│   ├── clingen/              # ClinGen-specific components
│   │   ├── ClinGenEvidenceForm.vue
│   │   ├── ClinGenScoreCard.vue
│   │   ├── CurationForm.vue
│   │   ├── EvidenceEntryForm.vue
│   │   └── PrecurationForm.vue
│   └── common/               # Reusable components
│       ├── AppBar.vue
│       ├── FooterBar.vue
│       ├── InfoField.vue
│       └── MessageSnackbar.vue
├── stores/                   # Pinia state management
│   ├── auth.js
│   ├── genes.js
│   ├── precurations.js
│   ├── curations.js
│   └── users.js
├── views/                    # Page-level components
│   ├── GenesTable.vue
│   ├── PrecurationsTable.vue
│   ├── CurationsTable.vue
│   ├── CurationDetail.vue
│   └── UserManagement.vue
├── api/                      # API client layer
│   ├── client.js
│   ├── auth.js
│   ├── genes.js
│   ├── precurations.js
│   └── curations.js
├── router/                   # Vue Router configuration
│   └── index.js
├── composables/              # Reusable composition functions
│   └── useNotifications.js
└── types/                    # TypeScript type definitions
    └── index.ts
```

## Component Architecture

### ClinGen-Specific Components

#### 1. PrecurationForm.vue
Handles the pre-curation workflow with gene selection and lumping/splitting decisions.

**Key Features**:
- HGNC gene autocomplete with validation
- MONDO ID lookup with external link integration
- Lumping/splitting decision workflow
- Real-time form validation
- Draft save functionality

**Usage Example**:
```vue
<template>
  <PrecurationForm 
    :precuration="editingPrecuration"
    :gene-id="selectedGeneId"
    @submit="handlePrecurationSubmit"
    @cancel="showForm = false"
    @saved="handlePrecurationSaved"
  />
</template>

<script setup>
import { ref } from 'vue'
import PrecurationForm from '@/components/clingen/PrecurationForm.vue'

const editingPrecuration = ref(null)
const selectedGeneId = ref(null)
const showForm = ref(false)

const handlePrecurationSubmit = (precuration) => {
  console.log('Precuration submitted:', precuration)
  showForm.value = false
}

const handlePrecurationSaved = (precuration) => {
  // Handle successful save
  emit('precuration-updated', precuration)
}
</script>
```

**Form Validation Rules**:
```javascript
// MONDO ID validation
const mondoIdRules = [
  value => !!value || 'MONDO ID is required',
  value => /^MONDO:\d+$/.test(value) || 'MONDO ID must be in format MONDO:######'
]

// Rationale validation  
const rationaleRules = [
  value => !!value || 'Rationale is required',
  value => value.length >= 50 || 'Rationale must be at least 50 characters'
]
```

#### 2. ClinGenEvidenceForm.vue
Multi-tab evidence entry form for genetic and experimental evidence with real-time scoring.

**Key Features**:
- Tabbed interface (Genetic/Experimental/Contradictory evidence)
- Real-time score calculation with SOP v11 limits
- PMID validation and lookup
- Evidence point assignment with visual feedback
- Auto-save drafts

**Evidence Entry Structure**:
```vue
<template>
  <v-tabs v-model="activeTab">
    <v-tab value="genetic">Genetic Evidence ({{ geneticScore }}/12)</v-tab>
    <v-tab value="experimental">Experimental Evidence ({{ experimentalScore }}/6)</v-tab>
    <v-tab value="contradictory">Contradictory Evidence</v-tab>
  </v-tabs>

  <v-tabs-window v-model="activeTab">
    <v-tabs-window-item value="genetic">
      <GeneticEvidencePanel 
        v-model="evidenceData.genetic_evidence"
        @score-changed="updateGeneticScore"
      />
    </v-tabs-window-item>
    
    <v-tabs-window-item value="experimental">
      <ExperimentalEvidencePanel 
        v-model="evidenceData.experimental_evidence"
        @score-changed="updateExperimentalScore"
      />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCurationsStore } from '@/stores/curations'

const curationsStore = useCurationsStore()
const activeTab = ref('genetic')
const evidenceData = ref({
  genetic_evidence: {},
  experimental_evidence: {},
  contradictory_evidence: []
})

// Real-time score calculation
const scores = computed(() => {
  return curationsStore.calculateScores(evidenceData.value)
})

const geneticScore = computed(() => scores.value.genetic_evidence_score)
const experimentalScore = computed(() => scores.value.experimental_evidence_score)

// Watch for evidence changes and update parent
watch(evidenceData, (newData) => {
  emit('evidence-changed', newData)
  emit('scores-changed', scores.value)
}, { deep: true })
</script>
```

#### 3. ClinGenScoreCard.vue
Real-time score display with progress bars and verdict prediction.

**Key Features**:
- Live score calculation display
- Progress bars for evidence categories
- SOP v11 limit indicators
- Verdict prediction based on current evidence
- Visual warnings for score overages

**Implementation**:
```vue
<template>
  <v-card>
    <v-card-title>
      <v-icon start color="primary">mdi-calculator</v-icon>
      ClinGen Evidence Scores
    </v-card-title>
    
    <v-card-text>
      <!-- Genetic Evidence Score -->
      <div class="mb-4">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-subtitle-1">Genetic Evidence</span>
          <span class="text-h6" :class="geneticScoreColor">
            {{ geneticScore }}/12
          </span>
        </div>
        <v-progress-linear 
          :model-value="(geneticScore / 12) * 100"
          :color="geneticScoreColor"
          height="8"
          rounded
        />
      </div>

      <!-- Experimental Evidence Score -->
      <div class="mb-4">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-subtitle-1">Experimental Evidence</span>
          <span class="text-h6" :class="experimentalScoreColor">
            {{ experimentalScore }}/6
          </span>
        </div>
        <v-progress-linear 
          :model-value="(experimentalScore / 6) * 100"
          :color="experimentalScoreColor"
          height="8"
          rounded
        />
      </div>

      <!-- Total Score and Verdict -->
      <v-divider class="my-4" />
      
      <div class="text-center">
        <div class="text-h4 mb-2" :class="verdictColor">
          {{ totalScore }}/18
        </div>
        <v-chip 
          :color="verdictColor" 
          size="large"
          variant="tonal"
        >
          {{ predictedVerdict }}
        </v-chip>
      </div>

      <!-- Score Breakdown -->
      <v-expansion-panels class="mt-4">
        <v-expansion-panel>
          <v-expansion-panel-title>Score Breakdown</v-expansion-panel-title>
          <v-expansion-panel-text>
            <ScoreBreakdown :evidence="evidenceData" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  geneticScore: { type: Number, default: 0 },
  experimentalScore: { type: Number, default: 0 },
  evidenceData: { type: Object, default: () => ({}) },
  hasContradictory: { type: Boolean, default: false }
})

const totalScore = computed(() => props.geneticScore + props.experimentalScore)

const predictedVerdict = computed(() => {
  if (props.hasContradictory) return 'Disputed'
  if (totalScore.value >= 12) return 'Definitive'
  if (totalScore.value >= 7) return 'Strong'
  if (totalScore.value >= 4) return 'Moderate'
  if (totalScore.value >= 1) return 'Limited'
  return 'No Known Disease Relationship'
})

const verdictColor = computed(() => {
  const colorMap = {
    'Definitive': 'success',
    'Strong': 'info',
    'Moderate': 'warning',
    'Limited': 'orange',
    'No Known Disease Relationship': 'grey',
    'Disputed': 'error'
  }
  return colorMap[predictedVerdict.value] || 'grey'
})

const geneticScoreColor = computed(() => {
  if (props.geneticScore > 12) return 'error'
  if (props.geneticScore >= 8) return 'success'
  if (props.geneticScore >= 4) return 'warning'
  return 'info'
})

const experimentalScoreColor = computed(() => {
  if (props.experimentalScore > 6) return 'error'
  if (props.experimentalScore >= 4) return 'success'
  if (props.experimentalScore >= 2) return 'warning'
  return 'info'
})
</script>
```

### Reusable Components

#### InfoField.vue
Displays structured information with optional help tooltips and external links.

```vue
<template>
  <div class="info-field">
    <div class="text-caption text-medium-emphasis">
      {{ label }}
      <v-tooltip v-if="help" location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" size="small" class="ml-1">
            mdi-help-circle-outline
          </v-icon>
        </template>
        <span>{{ help }}</span>
      </v-tooltip>
    </div>
    
    <div class="text-body-1" :class="valueClass">
      <slot>
        <a v-if="link" :href="link" target="_blank" class="text-decoration-none">
          {{ displayValue }}
          <v-icon size="small" class="ml-1">mdi-open-in-new</v-icon>
        </a>
        <span v-else>{{ displayValue }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number, Boolean, Object], default: null },
  help: { type: String, default: null },
  link: { type: String, default: null },
  format: { type: String, default: 'text' },
  emptyText: { type: String, default: 'Not specified' }
})

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return props.emptyText
  }
  
  switch (props.format) {
    case 'date':
      return new Date(props.value).toLocaleDateString()
    case 'datetime':
      return new Date(props.value).toLocaleString()
    case 'boolean':
      return props.value ? 'Yes' : 'No'
    case 'array':
      return Array.isArray(props.value) ? props.value.join(', ') : props.value
    default:
      return props.value
  }
})

const valueClass = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return 'text-medium-emphasis font-italic'
  }
  return 'font-weight-medium'
})
</script>
```

## State Management (Pinia)

### Store Architecture

Each major entity has its own Pinia store following a consistent pattern:

#### curations.js Store
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as curationsApi from '@/api/curations'

export const useCurationsStore = defineStore('curations', () => {
  // State
  const curations = ref([])
  const currentCuration = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getCurationById = computed(() => {
    return (id) => curations.value.find(c => c.id === id)
  })

  const curationsByVerdict = computed(() => {
    return curations.value.reduce((acc, curation) => {
      const verdict = curation.verdict
      if (!acc[verdict]) acc[verdict] = []
      acc[verdict].push(curation)
      return acc
    }, {})
  })

  const highConfidenceCurations = computed(() => {
    return curations.value.filter(c => 
      ['Definitive', 'Strong'].includes(c.verdict) && !c.has_contradictory_evidence
    )
  })

  // Actions
  const fetchCurations = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await curationsApi.getCurations(params)
      curations.value = response.data.curations
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCuration = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await curationsApi.getCuration(id)
      currentCuration.value = response.data
      
      // Update in list if exists
      const index = curations.value.findIndex(c => c.id === id)
      if (index !== -1) {
        curations.value[index] = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCuration = async (curationData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await curationsApi.createCuration(curationData)
      curations.value.push(response.data)
      currentCuration.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCuration = async (id, curationData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await curationsApi.updateCuration(id, curationData)
      
      // Update in list
      const index = curations.value.findIndex(c => c.id === id)
      if (index !== -1) {
        curations.value[index] = response.data
      }
      
      // Update current if it's the same curation
      if (currentCuration.value?.id === id) {
        currentCuration.value = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ClinGen-specific actions
  const calculateScores = (evidenceData) => {
    // Client-side score preview matching backend logic
    let geneticScore = 0
    let experimentalScore = 0

    if (evidenceData.genetic_evidence) {
      const { case_level_data = [], segregation_data = [], case_control_data = [] } = evidenceData.genetic_evidence
      
      // Calculate with SOP v11 maximums
      const caseLevelPoints = Math.min(12, sumPoints(case_level_data))
      const segregationPoints = Math.min(3, sumPoints(segregation_data))
      const caseControlPoints = Math.min(6, sumPoints(case_control_data))
      
      geneticScore = Math.min(12, caseLevelPoints + segregationPoints + caseControlPoints)
    }

    if (evidenceData.experimental_evidence) {
      const { function: functionEvidence = [], models = [], rescue = [] } = evidenceData.experimental_evidence
      const totalExperimental = sumPoints([...functionEvidence, ...models, ...rescue])
      experimentalScore = Math.min(6, totalExperimental)
    }

    return {
      genetic_evidence_score: geneticScore,
      experimental_evidence_score: experimentalScore,
      total_score: geneticScore + experimentalScore
    }
  }

  const generateSummary = async (curationId) => {
    try {
      const response = await curationsApi.generateSummary(curationId)
      return response.data.summary_text
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const approveCuration = async (id, comment) => {
    try {
      const response = await curationsApi.approveCuration(id, { comment })
      
      // Update in list
      const index = curations.value.findIndex(c => c.id === id)
      if (index !== -1) {
        curations.value[index] = { ...curations.value[index], ...response.data }
      }
      
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const publishCuration = async (id) => {
    try {
      const response = await curationsApi.publishCuration(id)
      
      // Update in list
      const index = curations.value.findIndex(c => c.id === id)
      if (index !== -1) {
        curations.value[index] = { ...curations.value[index], ...response.data }
      }
      
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Helper function
  const sumPoints = (evidenceArray) => {
    return evidenceArray.reduce((sum, item) => sum + (parseFloat(item.points) || 0), 0)
  }

  return {
    // State
    curations,
    currentCuration,
    loading,
    error,
    
    // Getters
    getCurationById,
    curationsByVerdict,
    highConfidenceCurations,
    
    // Actions
    fetchCurations,
    fetchCuration,
    createCuration,
    updateCuration,
    calculateScores,
    generateSummary,
    approveCuration,
    publishCuration
  }
})
```

### Store Usage in Components

```vue
<script setup>
import { onMounted, ref, computed } from 'vue'
import { useCurationsStore } from '@/stores/curations'
import { useNotifications } from '@/composables/useNotifications'

const curationsStore = useCurationsStore()
const { showSuccess, showError } = useNotifications()

const searchFilters = ref({
  verdict: null,
  gcep_affiliation: null,
  min_total_score: null
})

// Reactive data from store
const curations = computed(() => curationsStore.curations)
const loading = computed(() => curationsStore.loading)

// Load curations on mount
onMounted(async () => {
  try {
    await curationsStore.fetchCurations()
  } catch (error) {
    showError('Failed to load curations')
  }
})

// Search functionality
const searchCurations = async () => {
  try {
    await curationsStore.fetchCurations(searchFilters.value)
  } catch (error) {
    showError('Search failed')
  }
}

// Create new curation
const createCuration = async (curationData) => {
  try {
    const newCuration = await curationsStore.createCuration(curationData)
    showSuccess('Curation created successfully')
    return newCuration
  } catch (error) {
    showError(error.message || 'Failed to create curation')
    throw error
  }
}
</script>
```

## User Interface Patterns

### Data Tables with Vuetify

```vue
<template>
  <v-data-table
    :headers="headers"
    :items="curations"
    :loading="loading"
    :items-per-page="25"
    :search="search"
    class="elevation-1"
  >
    <!-- Gene symbol with link -->
    <template v-slot:item.gene.approved_symbol="{ item }">
      <router-link 
        :to="{ name: 'GeneDetail', params: { id: item.gene_id } }"
        class="text-decoration-none font-weight-medium"
      >
        {{ item.gene.approved_symbol }}
      </router-link>
    </template>

    <!-- Verdict with colored chip -->
    <template v-slot:item.verdict="{ item }">
      <v-chip 
        :color="getVerdictColor(item.verdict)" 
        size="small"
        variant="tonal"
      >
        {{ item.verdict }}
      </v-chip>
    </template>

    <!-- Score with progress -->
    <template v-slot:item.total_score="{ item }">
      <div class="d-flex align-center">
        <span class="mr-2">{{ item.total_score }}/18</span>
        <v-progress-linear
          :model-value="(item.total_score / 18) * 100"
          :color="getScoreColor(item.total_score)"
          height="4"
          width="60"
        />
      </div>
    </template>

    <!-- Status with workflow indicator -->
    <template v-slot:item.status="{ item }">
      <div class="d-flex align-center">
        <v-icon 
          :color="getStatusColor(item.status)" 
          size="small" 
          class="mr-1"
        >
          {{ getStatusIcon(item.status) }}
        </v-icon>
        <span>{{ formatStatus(item.status) }}</span>
      </div>
    </template>

    <!-- Actions -->
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        size="small"
        variant="text"
        :to="{ name: 'CurationDetail', params: { id: item.id } }"
      >
        <v-icon>mdi-eye</v-icon>
        <v-tooltip activator="parent" location="top">View Details</v-tooltip>
      </v-btn>
      
      <v-btn
        v-if="canEdit(item)"
        icon
        size="small"
        variant="text"
        @click="editCuration(item)"
      >
        <v-icon>mdi-pencil</v-icon>
        <v-tooltip activator="parent" location="top">Edit</v-tooltip>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const headers = [
  { title: 'Gene', key: 'gene.approved_symbol', sortable: true },
  { title: 'Disease', key: 'disease_name', sortable: true },
  { title: 'Verdict', key: 'verdict', sortable: true },
  { title: 'Score', key: 'total_score', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'GCEP', key: 'gcep_affiliation', sortable: true },
  { title: 'Created', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

const canEdit = (curation) => {
  return authStore.isAdmin || 
         (authStore.isCurator && curation.status === 'Draft' && curation.created_by === authStore.user.id)
}

const getVerdictColor = (verdict) => {
  const colors = {
    'Definitive': 'success',
    'Strong': 'info',
    'Moderate': 'warning',
    'Limited': 'orange',
    'No Known Disease Relationship': 'grey',
    'Disputed': 'error',
    'Refuted': 'error'
  }
  return colors[verdict] || 'grey'
}

const getScoreColor = (score) => {
  if (score >= 12) return 'success'
  if (score >= 7) return 'info'  
  if (score >= 4) return 'warning'
  return 'grey'
}

const getStatusColor = (status) => {
  const colors = {
    'Draft': 'grey',
    'In_Primary_Review': 'info',
    'In_Secondary_Review': 'warning',
    'Approved': 'success',
    'Published': 'success',
    'Rejected': 'error'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    'Draft': 'mdi-file-document-outline',
    'In_Primary_Review': 'mdi-account-search',
    'In_Secondary_Review': 'mdi-account-multiple-check',
    'Approved': 'mdi-check-circle',
    'Published': 'mdi-publish',
    'Rejected': 'mdi-close-circle'
  }
  return icons[status] || 'mdi-help-circle'
}

const formatStatus = (status) => {
  return status.replace(/_/g, ' ')
}
</script>
```

### Form Validation Patterns

```vue
<template>
  <v-form ref="formRef" @submit.prevent="handleSubmit">
    <v-text-field
      v-model="formData.mondo_id"
      label="MONDO ID *"
      :rules="mondoIdRules"
      :error-messages="fieldErrors.mondo_id"
      @input="clearFieldError('mondo_id')"
    />
    
    <v-textarea
      v-model="formData.rationale"
      label="Rationale *"
      :rules="rationaleRules"
      :counter="500"
      :error-messages="fieldErrors.rationale"
      @input="clearFieldError('rationale')"
    />
    
    <v-btn type="submit" :loading="submitting">Submit</v-btn>
  </v-form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formRef = ref(null)
const submitting = ref(false)
const fieldErrors = reactive({})

const formData = reactive({
  mondo_id: '',
  rationale: ''
})

// Validation rules
const mondoIdRules = [
  v => !!v || 'MONDO ID is required',
  v => /^MONDO:\d+$/.test(v) || 'Invalid MONDO ID format'
]

const rationaleRules = [
  v => !!v || 'Rationale is required',
  v => v.length >= 50 || 'Rationale must be at least 50 characters',
  v => v.length <= 500 || 'Rationale must not exceed 500 characters'
]

const clearFieldError = (field) => {
  if (fieldErrors[field]) {
    delete fieldErrors[field]
  }
}

const handleSubmit = async () => {
  const validation = await formRef.value.validate()
  if (!validation.valid) {
    return
  }

  submitting.value = true
  
  try {
    await submitForm(formData)
    emit('success')
  } catch (error) {
    // Handle API validation errors
    if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
      error.response.data.detail.forEach(err => {
        if (err.loc && err.loc.length > 1) {
          const field = err.loc[err.loc.length - 1]
          fieldErrors[field] = [err.msg]
        }
      })
    }
  } finally {
    submitting.value = false
  }
}
</script>
```

## Routing and Navigation

### Router Configuration

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/genes',
    name: 'GenesTable',
    component: () => import('@/views/GenesTable.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/genes/:id',
    name: 'GeneDetail',
    component: () => import('@/views/GeneDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/precurations',
    name: 'PrecurationsTable', 
    component: () => import('@/views/PrecurationsTable.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/curations',
    name: 'CurationsTable',
    component: () => import('@/views/CurationsTable.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/curations/:id',
    name: 'CurationDetail',
    component: () => import('@/views/CurationDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/curations/create',
    name: 'CreateCuration',
    component: () => import('@/views/CreateCuration.vue'),
    meta: { requiresAuth: true, requiresCurator: true }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: () => import('@/views/UserManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { guest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth store if needed
  if (!authStore.initialized) {
    await authStore.initialize()
  }
  
  // Redirect authenticated users away from guest pages
  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'Home' })
  }
  
  // Require authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  
  // Require curator role
  if (to.meta.requiresCurator && !authStore.isCurator && !authStore.isAdmin) {
    return next({ name: 'NotAuthorized' })
  }
  
  // Require admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'NotAuthorized' })
  }
  
  next()
})

export default router
```

### Navigation Component

```vue
<template>
  <v-app-bar color="primary" dark>
    <v-app-bar-title>
      <router-link to="/" class="text-decoration-none text-white">
        Gene Curator
      </router-link>
    </v-app-bar-title>

    <v-spacer />

    <template v-if="isAuthenticated">
      <!-- Navigation menu -->
      <v-btn variant="text" :to="{ name: 'GenesTable' }">
        <v-icon start>mdi-dna</v-icon>
        Genes
      </v-btn>
      
      <v-btn variant="text" :to="{ name: 'PrecurationsTable' }">
        <v-icon start>mdi-clipboard-text</v-icon>
        Pre-curations
      </v-btn>
      
      <v-btn variant="text" :to="{ name: 'CurationsTable' }">
        <v-icon start>mdi-file-document</v-icon>
        Curations
      </v-btn>

      <!-- Admin menu -->
      <v-menu v-if="isAdmin">
        <template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props">
            <v-icon start>mdi-cog</v-icon>
            Admin
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        
        <v-list>
          <v-list-item :to="{ name: 'UserManagement' }">
            <v-list-item-title>User Management</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>System Settings</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- User menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props">
            <v-avatar size="32" class="mr-2">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
            {{ user.name }}
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        
        <v-list>
          <v-list-item :to="{ name: 'UserProfile' }">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <!-- Guest navigation -->
    <template v-else>
      <v-btn variant="text" :to="{ name: 'Login' }">
        Login
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)

const logout = async () => {
  await authStore.logout()
  router.push({ name: 'Home' })
}
</script>
```

## Development Workflow

### Local Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

### Code Quality Tools

**ESLint Configuration** (`.eslintrc.js`):
```javascript
module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/no-mutating-props': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
  },
}
```

**Prettier Configuration** (`.prettierrc`):
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "vueIndentScriptAndStyle": true
}
```

### Testing Strategy

**Component Testing with Vitest**:
```javascript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PrecurationForm from '@/components/clingen/PrecurationForm.vue'

describe('PrecurationForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('validates MONDO ID format', async () => {
    const wrapper = mount(PrecurationForm, {
      props: {
        precuration: null
      }
    })

    const mondoField = wrapper.find('[data-testid="mondo-id-field"]')
    await mondoField.setValue('INVALID')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.text()).toContain('Invalid MONDO ID format')
  })

  it('emits submit event with valid data', async () => {
    const wrapper = mount(PrecurationForm)
    
    // Fill form with valid data
    await wrapper.find('[data-testid="mondo-id-field"]').setValue('MONDO:0002113')
    await wrapper.find('[data-testid="rationale-field"]').setValue('This is a valid rationale with sufficient length to pass validation rules.')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0][0]).toMatchObject({
      mondo_id: 'MONDO:0002113',
      rationale: expect.any(String)
    })
  })
})
```

### Performance Optimization

**Lazy Loading Routes**:
```javascript
const routes = [
  {
    path: '/curations/:id',
    name: 'CurationDetail',
    component: () => import(/* webpackChunkName: "curation-detail" */ '@/views/CurationDetail.vue')
  }
]
```

**Component Lazy Loading**:
```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const ClinGenScoreCard = defineAsyncComponent(() =>
  import('@/components/clingen/ClinGenScoreCard.vue')
)
</script>
```

**Virtual Scrolling for Large Lists**:
```vue
<template>
  <v-virtual-scroll
    :items="curations"
    :item-height="64"
    height="400"
  >
    <template v-slot:default="{ item }">
      <CurationListItem :curation="item" />
    </template>
  </v-virtual-scroll>
</template>
```

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - Overall system design
- [API Reference](./API_REFERENCE.md) - Backend integration details
- [ClinGen Compliance](./CLINGEN_COMPLIANCE.md) - Evidence entry requirements
- [Database Schema](./DATABASE_SCHEMA.md) - Data structure understanding
- [Workflow Documentation](./WORKFLOW.md) - Business process flows