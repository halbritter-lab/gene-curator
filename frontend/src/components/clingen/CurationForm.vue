<template>
  <v-form ref="formRef" @submit.prevent="handleSubmit">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="text-h5 mb-4">
            <v-icon start>mdi-clipboard-check</v-icon>
            {{ isEditing ? 'Edit' : 'Create' }} ClinGen Curation
          </h2>
        </v-col>
      </v-row>

      <!-- Basic Information -->
      <v-row>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="formData.gene_id"
            :items="availableGenes"
            item-title="approved_symbol"
            item-value="id"
            label="Gene *"
            placeholder="Search for a gene..."
            variant="outlined"
            :rules="requiredRules"
            :loading="genesLoading"
            return-object
            @update:model-value="onGeneSelected"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.raw.approved_symbol }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.hgnc_id }} • {{ item.raw.current_dyadic_name || 'No dyadic name' }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="formData.precuration_id"
            :items="availablePrecurations"
            item-title="mondo_id"
            item-value="id"
            label="Associated Precuration"
            placeholder="Select a precuration (optional)"
            variant="outlined"
            clearable
            :loading="precurationsLoading"
            return-object
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.raw.mondo_id }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.mode_of_inheritance }} • {{ item.raw.lumping_splitting_decision }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.mondo_id"
            label="MONDO ID *"
            placeholder="MONDO:0000001"
            variant="outlined"
            :rules="mondoIdRules"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="formData.mode_of_inheritance"
            :items="inheritanceModes"
            label="Mode of Inheritance *"
            variant="outlined"
            :rules="requiredRules"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.disease_name"
            label="Disease Name *"
            placeholder="Enter the disease name"
            variant="outlined"
            :rules="requiredRules"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.gcep_affiliation"
            label="GCEP Affiliation *"
            placeholder="e.g., Cardiovascular GCEP"
            variant="outlined"
            :rules="requiredRules"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="formData.verdict"
            :items="verdictOptions"
            label="Provisional Verdict"
            variant="outlined"
            :hint="verdictHint"
            persistent-hint
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="formData.sop_version"
            :items="sopVersions"
            label="SOP Version"
            variant="outlined"
            :rules="requiredRules"
          />
        </v-col>
      </v-row>

      <!-- Evidence Entry Section -->
      <v-row>
        <v-col cols="12">
          <v-divider class="my-4" />
          <h3 class="text-h6 mb-4">Evidence Entry</h3>
          
          <ClinGenEvidenceForm
            v-model="formData.details"
            @update:model-value="updateEvidence"
          />
        </v-col>
      </v-row>

      <!-- Live Score Preview -->
      <v-row v-if="scorePreview">
        <v-col cols="12">
          <v-divider class="my-4" />
          <h3 class="text-h6 mb-4">Score Preview</h3>
          
          <ClinGenScoreCard
            :score="scorePreview"
            :show-actions="false"
          />
        </v-col>
      </v-row>

      <!-- Summary Text -->
      <v-row>
        <v-col cols="12">
          <v-divider class="my-4" />
          <v-textarea
            v-model="formData.summary_text"
            label="Evidence Summary"
            placeholder="Optional: Provide a summary of the evidence and rationale for the classification..."
            variant="outlined"
            rows="4"
            auto-grow
          />
        </v-col>
      </v-row>

      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12" class="d-flex justify-end gap-3">
          <v-btn
            variant="outlined"
            @click="$emit('cancel')"
          >
            Cancel
          </v-btn>
          
          <v-btn
            v-if="!isEditing"
            variant="outlined"
            color="primary"
            @click="saveDraft"
            :loading="saving"
          >
            Save as Draft
          </v-btn>
          
          <v-btn
            color="primary"
            type="submit"
            :loading="saving"
          >
            {{ isEditing ? 'Update Curation' : 'Create Curation' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGenesStore, usePrecurationsStore, useCurationsStore } from '@/stores'
import { showError, showSuccess } from '@/composables/useNotifications.js'
import ClinGenEvidenceForm from './ClinGenEvidenceForm.vue'
import ClinGenScoreCard from './ClinGenScoreCard.vue'

const props = defineProps({
  curation: {
    type: Object,
    default: null
  },
  geneId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel', 'saved'])

const formRef = ref(null)
const saving = ref(false)
const genesLoading = ref(false)
const precurationsLoading = ref(false)

const genesStore = useGenesStore()
const precurationsStore = usePrecurationsStore()
const curationsStore = useCurationsStore()

const isEditing = computed(() => !!props.curation)

// Form data
const formData = ref({
  gene_id: props.geneId || null,
  precuration_id: null,
  mondo_id: '',
  mode_of_inheritance: 'Autosomal Dominant',
  disease_name: '',
  verdict: 'Limited',
  gcep_affiliation: '',
  sop_version: 'v11',
  summary_text: '',
  details: {
    genetic_evidence: {
      case_level_data: [],
      segregation_data: [],
      case_control_data: []
    },
    experimental_evidence: {
      function: [],
      models: [],
      rescue: []
    },
    contradictory_evidence: []
  }
})

// Initialize form with existing curation data
if (props.curation) {
  Object.assign(formData.value, props.curation)
}

const availableGenes = ref([])
const availablePrecurations = ref([])

const inheritanceModes = [
  'Autosomal Dominant',
  'Autosomal Recessive', 
  'X-linked',
  'X-linked Dominant',
  'X-linked Recessive',
  'Mitochondrial',
  'Somatic',
  'Other'
]

const verdictOptions = [
  { title: 'Definitive', value: 'Definitive' },
  { title: 'Strong', value: 'Strong' },
  { title: 'Moderate', value: 'Moderate' },
  { title: 'Limited', value: 'Limited' },
  { title: 'No Known Disease Relationship', value: 'No Known Disease Relationship' },
  { title: 'Disputed', value: 'Disputed' },
  { title: 'Refuted', value: 'Refuted' }
]

const sopVersions = ['v11', 'v10', 'v9']

const verdictHint = computed(() => {
  const hints = {
    'Definitive': '12-18 points + replication over time',
    'Strong': '12-18 points',
    'Moderate': '7-11 points',
    'Limited': '1-6 points',
    'No Known Disease Relationship': '<1 point',
    'Disputed': 'Contradictory evidence present',
    'Refuted': 'Evidence against relationship'
  }
  return hints[formData.value.verdict] || ''
})

// Validation rules
const requiredRules = [
  (value) => !!value || 'This field is required'
]

const mondoIdRules = [
  (value) => !!value || 'MONDO ID is required',
  (value) => /^MONDO:\d+$/.test(value) || 'MONDO ID must be in format MONDO:######'
]

// Score preview computation
const scorePreview = ref(null)

watch(() => formData.value.details, async () => {
  // Calculate preview score based on evidence
  updateScorePreview()
}, { deep: true })

const updateScorePreview = () => {
  const genetic = formData.value.details.genetic_evidence || {}
  const experimental = formData.value.details.experimental_evidence || {}
  const contradictory = formData.value.details.contradictory_evidence || []

  // Calculate genetic evidence score (max 12)
  const geneticScore = Math.min(12, 
    (genetic.case_level_data || []).reduce((sum, item) => sum + (item.points || 0), 0) +
    (genetic.segregation_data || []).reduce((sum, item) => sum + (item.points || 0), 0) +
    (genetic.case_control_data || []).reduce((sum, item) => sum + (item.points || 0), 0)
  )

  // Calculate experimental evidence score (max 6)
  const experimentalScore = Math.min(6,
    (experimental.function || []).reduce((sum, item) => sum + (item.points || 0), 0) +
    (experimental.models || []).reduce((sum, item) => sum + (item.points || 0), 0) +
    (experimental.rescue || []).reduce((sum, item) => sum + (item.points || 0), 0)
  )

  const totalScore = geneticScore + experimentalScore
  const hasContradictory = contradictory.length > 0

  // Determine verdict based on score
  let calculatedVerdict = formData.value.verdict || 'Limited'
  if (hasContradictory) {
    calculatedVerdict = 'Disputed'
  } else if (totalScore >= 12) {
    calculatedVerdict = 'Strong' // Can be Definitive with replication
  } else if (totalScore >= 7) {
    calculatedVerdict = 'Moderate'
  } else if (totalScore >= 1) {
    calculatedVerdict = 'Limited'
  } else {
    calculatedVerdict = 'No Known Disease Relationship'
  }

  scorePreview.value = {
    genetic_evidence_score: geneticScore,
    experimental_evidence_score: experimentalScore,
    total_score: totalScore,
    verdict: calculatedVerdict,
    has_contradictory_evidence: hasContradictory,
    evidence_breakdown: {
      case_level_evidence: (genetic.case_level_data || []).length,
      segregation_evidence: (genetic.segregation_data || []).length,
      case_control_evidence: (genetic.case_control_data || []).length,
      functional_evidence: (experimental.function || []).length,
      model_evidence: (experimental.models || []).length,
      rescue_evidence: (experimental.rescue || []).length
    },
    classification_rationale: getClassificationRationale(totalScore, hasContradictory)
  }
}

const getClassificationRationale = (totalScore, hasContradictory) => {
  if (hasContradictory) {
    return "Classification disputed due to contradictory evidence requiring expert review"
  }
  
  if (totalScore >= 12) {
    return "Strong or Definitive evidence (≥12 points). Definitive requires replication over time."
  } else if (totalScore >= 7) {
    return "Moderate evidence (7-11 points) supporting gene-disease relationship"
  } else if (totalScore >= 1) {
    return "Limited evidence (1-6 points) supporting gene-disease relationship"  
  } else {
    return "Insufficient evidence (<1 point) for gene-disease relationship"
  }
}

const updateEvidence = (newEvidence) => {
  formData.value.details = newEvidence
}

const onGeneSelected = (gene) => {
  if (gene) {
    // Load precurations for this gene
    loadPrecurationsForGene(gene.id)
  }
}

const loadGenes = async () => {
  try {
    genesLoading.value = true
    await genesStore.fetchSummary()
    availableGenes.value = genesStore.summary
  } catch (error) {
    showError('Failed to load genes')
  } finally {
    genesLoading.value = false
  }
}

const loadPrecurationsForGene = async (geneId) => {
  try {
    precurationsLoading.value = true
    const precurations = await precurationsStore.fetchPrecurationsByGene(geneId)
    availablePrecurations.value = precurations
  } catch (error) {
    showError('Failed to load precurations for gene')
  } finally {
    precurationsLoading.value = false
  }
}

const saveDraft = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid.valid) {
    showError('Please fix validation errors before saving')
    return
  }

  await handleSubmit('Draft')
}

const handleSubmit = async (status = 'Draft') => {
  try {
    saving.value = true
    
    const isValid = await formRef.value.validate()
    if (!isValid.valid) {
      showError('Please fix validation errors before submitting')
      return
    }

    const curationData = {
      ...formData.value,
      status
    }

    let result
    if (isEditing.value) {
      result = await curationsStore.updateCuration(props.curation.id, curationData)
      showSuccess('Curation updated successfully')
    } else {
      result = await curationsStore.createCuration(curationData)
      showSuccess('Curation created successfully')
    }

    emit('submit', result)
    emit('saved', result)
    
  } catch (error) {
    showError(error.message || 'Failed to save curation')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadGenes()
  updateScorePreview()
  
  if (props.geneId) {
    loadPrecurationsForGene(props.geneId)
  }
})
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>