<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="localEvidence.pmid"
          label="PMID"
          placeholder="12345678"
          variant="outlined"
          density="compact"
          :rules="pmidRules"
          @blur="validatePMID"
        >
          <template #append-inner>
            <v-btn
              v-if="localEvidence.pmid"
              icon
              size="x-small"
              variant="text"
              :href="`https://pubmed.ncbi.nlm.nih.gov/${localEvidence.pmid}/`"
              target="_blank"
            >
              <v-icon size="small">mdi-open-in-new</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>

      <v-col cols="12" md="6">
        <v-textarea
          v-model="localEvidence.description"
          label="Evidence Description"
          placeholder="Describe the evidence and its relevance to the gene-disease relationship..."
          variant="outlined"
          density="compact"
          rows="2"
          auto-grow
          :rules="descriptionRules"
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-text-field
          v-model.number="localEvidence.points"
          label="Points"
          type="number"
          variant="outlined"
          density="compact"
          :min="allowNegativePoints ? undefined : 0"
          :max="maxPoints"
          :step="0.5"
          :rules="pointsRules"
        >
          <template #append-inner>
            <div class="text-caption text-medium-emphasis">/{{ maxPoints }}</div>
          </template>
        </v-text-field>
      </v-col>

      <v-col cols="12" md="2">
        <div class="d-flex align-center h-100">
          <v-btn icon size="small" color="error" variant="text" @click="$emit('remove')">
            <v-icon>mdi-delete</v-icon>
          </v-btn>

          <v-menu v-if="showGuidance" location="bottom">
            <template #activator="{ props }">
              <v-btn icon size="small" color="info" variant="text" v-bind="props">
                <v-icon>mdi-help-circle</v-icon>
              </v-btn>
            </template>

            <v-card max-width="400">
              <v-card-title class="text-subtitle-1">
                {{ evidenceType }} Evidence Guidance
              </v-card-title>
              <v-card-text class="text-body-2">
                {{ getEvidenceGuidance() }}
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
      </v-col>
    </v-row>

    <!-- Validation Messages -->
    <v-row v-if="validationMessage">
      <v-col cols="12">
        <v-alert :type="validationMessage.type" variant="tonal" density="compact">
          {{ validationMessage.text }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true
    },
    evidenceType: {
      type: String,
      required: true
    },
    maxPoints: {
      type: Number,
      default: 12
    },
    allowNegativePoints: {
      type: Boolean,
      default: false
    },
    showGuidance: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits(['update:modelValue', 'remove'])

  const localEvidence = ref({ ...props.modelValue })
  const validationMessage = ref(null)

  // Watch for changes and emit updates
  watch(
    localEvidence,
    newValue => {
      emit('update:modelValue', { ...newValue })
    },
    { deep: true }
  )

  // Watch for external changes
  watch(
    () => props.modelValue,
    newValue => {
      localEvidence.value = { ...newValue }
    },
    { deep: true }
  )

  const pmidRules = [
    value => {
      if (!value) return true // PMID is optional
      if (!/^\d+$/.test(value)) {
        return 'PMID must be numeric'
      }
      if (value.length < 6 || value.length > 10) {
        return 'PMID should be 6-10 digits'
      }
      return true
    }
  ]

  const descriptionRules = [
    value => {
      if (!value || value.trim().length === 0) {
        return 'Evidence description is required'
      }
      if (value.length < 10) {
        return 'Description should be at least 10 characters'
      }
      return true
    }
  ]

  const pointsRules = computed(() => [
    value => {
      if (value === null || value === undefined || value === '') {
        return 'Points value is required'
      }
      if (isNaN(value)) {
        return 'Points must be a number'
      }
      if (!props.allowNegativePoints && value < 0) {
        return 'Points cannot be negative'
      }
      if (value > props.maxPoints) {
        return `Points cannot exceed ${props.maxPoints}`
      }
      return true
    }
  ])

  const validatePMID = async () => {
    if (!localEvidence.value.pmid) {
      validationMessage.value = null
      return
    }

    // Basic validation
    if (!/^\d+$/.test(localEvidence.value.pmid)) {
      validationMessage.value = {
        type: 'error',
        text: 'Invalid PMID format'
      }
      return
    }

    // Note: In a real implementation, you might want to validate against PubMed API
    validationMessage.value = {
      type: 'success',
      text: 'PMID format is valid'
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      validationMessage.value = null
    }, 3000)
  }

  const getEvidenceGuidance = () => {
    const guidance = {
      'Case-level':
        'Evidence from individual cases or families with variants in the gene. Include pathogenic/likely pathogenic variants, de novo occurrences, and well-segregated families. Maximum 12 points total.',
      Segregation:
        'Evidence from segregation analysis within families. Include LOD scores and family studies. Maximum 3 points total.',
      'Case-control':
        'Evidence from case-control studies comparing variant frequencies between affected and unaffected populations. Maximum 6 points total.',
      Functional:
        'Evidence from biochemical function, protein interaction, or expression studies. Include functional assays that support the gene-disease mechanism.',
      Model:
        'Evidence from model organisms (mouse, zebrafish, etc.) or cell culture models that recapitulate disease phenotypes.',
      Rescue:
        'Evidence showing that gene/protein function can rescue disease phenotypes in models or patients.',
      Contradictory:
        'Evidence that contradicts or disputes the gene-disease relationship. This may include non-segregating variants, conflicting functional studies, or population frequency data.'
    }

    return (
      guidance[props.evidenceType] ||
      'Provide detailed evidence supporting or contradicting the gene-disease relationship.'
    )
  }
</script>

<style scoped>
  .v-container {
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  .v-container:hover {
    background-color: rgba(var(--v-theme-surface-variant), 0.5);
  }

  .v-text-field,
  .v-textarea {
    margin-bottom: 0;
  }
</style>
