<template>
  <v-card class="score-card">
    <v-card-title class="d-flex align-center">
      <v-icon start :color="verdictColor">{{ verdictIcon }}</v-icon>
      ClinGen Score Breakdown
    </v-card-title>
    
    <v-card-text>
      <!-- Overall Score Display -->
      <div class="text-center mb-6">
        <v-chip 
          :color="verdictColor" 
          size="large" 
          class="text-h6 px-4 py-2 mb-2"
        >
          {{ score.verdict }}
        </v-chip>
        <div class="text-h4 font-weight-bold">
          {{ score.total_score.toFixed(1) }}/18
        </div>
        <div class="text-subtitle-1 text-medium-emphasis">
          Total Evidence Score
        </div>
      </div>

      <!-- Score Breakdown -->
      <div class="score-breakdown">
        <div class="mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-1 font-weight-medium">Genetic Evidence</span>
            <span class="text-h6">{{ score.genetic_evidence_score.toFixed(1) }}/12</span>
          </div>
          <v-progress-linear
            :model-value="(score.genetic_evidence_score / 12) * 100"
            color="primary"
            height="8"
            rounded
          />
        </div>

        <div class="mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-subtitle-1 font-weight-medium">Experimental Evidence</span>
            <span class="text-h6">{{ score.experimental_evidence_score.toFixed(1) }}/6</span>
          </div>
          <v-progress-linear
            :model-value="(score.experimental_evidence_score / 6) * 100"
            color="secondary"
            height="8"
            rounded
          />
        </div>
      </div>

      <!-- Evidence Breakdown -->
      <v-divider class="my-4" />
      
      <div class="evidence-breakdown">
        <h4 class="text-subtitle-1 font-weight-medium mb-3">Evidence Summary</h4>
        
        <v-row class="text-body-2">
          <v-col cols="6">
            <div class="mb-2">
              <v-icon size="small" start color="primary">mdi-account-group</v-icon>
              Case-level: {{ score.evidence_breakdown?.case_level_evidence || 0 }}
            </div>
            <div class="mb-2">
              <v-icon size="small" start color="primary">mdi-family-tree</v-icon>
              Segregation: {{ score.evidence_breakdown?.segregation_evidence || 0 }}
            </div>
            <div class="mb-2">
              <v-icon size="small" start color="primary">mdi-chart-bar</v-icon>
              Case-control: {{ score.evidence_breakdown?.case_control_evidence || 0 }}
            </div>
          </v-col>
          <v-col cols="6">
            <div class="mb-2">
              <v-icon size="small" start color="secondary">mdi-cog</v-icon>
              Functional: {{ score.evidence_breakdown?.functional_evidence || 0 }}
            </div>
            <div class="mb-2">
              <v-icon size="small" start color="secondary">mdi-mouse</v-icon>
              Model: {{ score.evidence_breakdown?.model_evidence || 0 }}
            </div>
            <div class="mb-2">
              <v-icon size="small" start color="secondary">mdi-restore</v-icon>
              Rescue: {{ score.evidence_breakdown?.rescue_evidence || 0 }}
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Contradictory Evidence Warning -->
      <v-alert
        v-if="score.has_contradictory_evidence"
        type="warning"
        variant="tonal"
        class="mt-4"
        density="compact"
      >
        <template v-slot:prepend>
          <v-icon>mdi-alert-triangle</v-icon>
        </template>
        This curation has contradictory evidence that may impact the classification.
      </v-alert>

      <!-- Classification Rationale -->
      <v-divider class="my-4" />
      
      <div class="classification-rationale">
        <h4 class="text-subtitle-1 font-weight-medium mb-2">Classification Rationale</h4>
        <p class="text-body-2 text-medium-emphasis">
          {{ score.classification_rationale }}
        </p>
      </div>
    </v-card-text>

    <v-card-actions v-if="showActions">
      <v-spacer />
      <v-btn
        v-if="detailedView"
        variant="text"
        color="primary"
        @click="$emit('view-details')"
      >
        View Evidence Details
      </v-btn>
      <v-btn
        v-if="allowEdit"
        variant="text"
        color="primary"
        @click="$emit('edit-curation')"
      >
        Edit Curation
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  },
  detailedView: {
    type: Boolean,
    default: false
  },
  allowEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view-details', 'edit-curation'])

const verdictColor = computed(() => {
  const colors = {
    'Definitive': 'success',
    'Strong': 'info',
    'Moderate': 'warning',
    'Limited': 'orange',
    'No Known Disease Relationship': 'grey',
    'Disputed': 'error',
    'Refuted': 'error'
  }
  return colors[props.score.verdict] || 'grey'
})

const verdictIcon = computed(() => {
  const icons = {
    'Definitive': 'mdi-check-circle',
    'Strong': 'mdi-check-circle-outline',
    'Moderate': 'mdi-alert-circle',
    'Limited': 'mdi-help-circle',
    'No Known Disease Relationship': 'mdi-minus-circle',
    'Disputed': 'mdi-alert-triangle',
    'Refuted': 'mdi-close-circle'
  }
  return icons[props.score.verdict] || 'mdi-help-circle'
})
</script>

<style scoped>
.score-card {
  max-width: 100%;
}

.score-breakdown {
  border-radius: 8px;
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 16px;
}

.evidence-breakdown {
  font-size: 0.875rem;
}

.v-progress-linear {
  border-radius: 4px;
}
</style>