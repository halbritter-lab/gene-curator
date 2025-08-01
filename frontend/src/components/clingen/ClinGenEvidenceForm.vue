<template>
  <v-card>
    <v-card-title>
      <v-icon start>mdi-clipboard-list</v-icon>
      ClinGen Evidence Entry
    </v-card-title>

    <v-card-text>
      <v-tabs v-model="activeTab" class="mb-4">
        <v-tab value="genetic">Genetic Evidence</v-tab>
        <v-tab value="experimental">Experimental Evidence</v-tab>
        <v-tab value="contradictory">Contradictory Evidence</v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- Genetic Evidence Tab -->
        <v-window-item value="genetic">
          <div class="genetic-evidence">
            <!-- Case-Level Data -->
            <v-expansion-panels class="mb-4">
              <v-expansion-panel title="Case-Level Data (Max 12 points)">
                <v-expansion-panel-text>
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-subtitle-1"
                      >Current Score: {{ getCategoryScore('genetic', 'case_level_data') }}/12
                      points</span
                    >
                    <v-btn
                      size="small"
                      color="primary"
                      @click="addEvidence('genetic', 'case_level_data')"
                    >
                      <v-icon start size="small">mdi-plus</v-icon>
                      Add Evidence
                    </v-btn>
                  </div>

                  <div
                    v-if="geneticEvidence.case_level_data.length === 0"
                    class="text-center py-4 text-medium-emphasis"
                  >
                    No case-level evidence entries yet
                  </div>

                  <v-card
                    v-for="(evidence, index) in geneticEvidence.case_level_data"
                    :key="`case-${index}`"
                    variant="outlined"
                    class="mb-3"
                  >
                    <v-card-text>
                      <EvidenceEntryForm
                        v-model="geneticEvidence.case_level_data[index]"
                        :evidence-type="'Case-level'"
                        :max-points="12"
                        @remove="removeEvidence('genetic', 'case_level_data', index)"
                      />
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Segregation Data -->
              <v-expansion-panel title="Segregation Data (Max 3 points)">
                <v-expansion-panel-text>
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-subtitle-1"
                      >Current Score: {{ getCategoryScore('genetic', 'segregation_data') }}/3
                      points</span
                    >
                    <v-btn
                      size="small"
                      color="primary"
                      @click="addEvidence('genetic', 'segregation_data')"
                    >
                      <v-icon start size="small">mdi-plus</v-icon>
                      Add Evidence
                    </v-btn>
                  </div>

                  <div
                    v-if="geneticEvidence.segregation_data.length === 0"
                    class="text-center py-4 text-medium-emphasis"
                  >
                    No segregation evidence entries yet
                  </div>

                  <v-card
                    v-for="(evidence, index) in geneticEvidence.segregation_data"
                    :key="`seg-${index}`"
                    variant="outlined"
                    class="mb-3"
                  >
                    <v-card-text>
                      <EvidenceEntryForm
                        v-model="geneticEvidence.segregation_data[index]"
                        :evidence-type="'Segregation'"
                        :max-points="3"
                        @remove="removeEvidence('genetic', 'segregation_data', index)"
                      />
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Case-Control Data -->
              <v-expansion-panel title="Case-Control Data (Max 6 points)">
                <v-expansion-panel-text>
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-subtitle-1"
                      >Current Score: {{ getCategoryScore('genetic', 'case_control_data') }}/6
                      points</span
                    >
                    <v-btn
                      size="small"
                      color="primary"
                      @click="addEvidence('genetic', 'case_control_data')"
                    >
                      <v-icon start size="small">mdi-plus</v-icon>
                      Add Evidence
                    </v-btn>
                  </div>

                  <div
                    v-if="geneticEvidence.case_control_data.length === 0"
                    class="text-center py-4 text-medium-emphasis"
                  >
                    No case-control evidence entries yet
                  </div>

                  <v-card
                    v-for="(evidence, index) in geneticEvidence.case_control_data"
                    :key="`cc-${index}`"
                    variant="outlined"
                    class="mb-3"
                  >
                    <v-card-text>
                      <EvidenceEntryForm
                        v-model="geneticEvidence.case_control_data[index]"
                        :evidence-type="'Case-control'"
                        :max-points="6"
                        @remove="removeEvidence('genetic', 'case_control_data', index)"
                      />
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-window-item>

        <!-- Experimental Evidence Tab -->
        <v-window-item value="experimental">
          <div class="experimental-evidence">
            <!-- Function Evidence -->
            <v-expansion-panels class="mb-4">
              <v-expansion-panel title="Functional Evidence">
                <v-expansion-panel-text>
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-subtitle-1"
                      >Current Score:
                      {{ getCategoryScore('experimental', 'function') }} points</span
                    >
                    <v-btn
                      size="small"
                      color="secondary"
                      @click="addEvidence('experimental', 'function')"
                    >
                      <v-icon start size="small">mdi-plus</v-icon>
                      Add Evidence
                    </v-btn>
                  </div>

                  <div
                    v-if="experimentalEvidence.function.length === 0"
                    class="text-center py-4 text-medium-emphasis"
                  >
                    No functional evidence entries yet
                  </div>

                  <v-card
                    v-for="(evidence, index) in experimentalEvidence.function"
                    :key="`func-${index}`"
                    variant="outlined"
                    class="mb-3"
                  >
                    <v-card-text>
                      <EvidenceEntryForm
                        v-model="experimentalEvidence.function[index]"
                        :evidence-type="'Functional'"
                        :max-points="2"
                        @remove="removeEvidence('experimental', 'function', index)"
                      />
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Model Evidence -->
              <v-expansion-panel title="Model Evidence">
                <v-expansion-panel-text>
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-subtitle-1"
                      >Current Score: {{ getCategoryScore('experimental', 'models') }} points</span
                    >
                    <v-btn
                      size="small"
                      color="secondary"
                      @click="addEvidence('experimental', 'models')"
                    >
                      <v-icon start size="small">mdi-plus</v-icon>
                      Add Evidence
                    </v-btn>
                  </div>

                  <div
                    v-if="experimentalEvidence.models.length === 0"
                    class="text-center py-4 text-medium-emphasis"
                  >
                    No model evidence entries yet
                  </div>

                  <v-card
                    v-for="(evidence, index) in experimentalEvidence.models"
                    :key="`model-${index}`"
                    variant="outlined"
                    class="mb-3"
                  >
                    <v-card-text>
                      <EvidenceEntryForm
                        v-model="experimentalEvidence.models[index]"
                        :evidence-type="'Model'"
                        :max-points="4"
                        @remove="removeEvidence('experimental', 'models', index)"
                      />
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Rescue Evidence -->
              <v-expansion-panel title="Rescue Evidence">
                <v-expansion-panel-text>
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-subtitle-1"
                      >Current Score: {{ getCategoryScore('experimental', 'rescue') }} points</span
                    >
                    <v-btn
                      size="small"
                      color="secondary"
                      @click="addEvidence('experimental', 'rescue')"
                    >
                      <v-icon start size="small">mdi-plus</v-icon>
                      Add Evidence
                    </v-btn>
                  </div>

                  <div
                    v-if="experimentalEvidence.rescue.length === 0"
                    class="text-center py-4 text-medium-emphasis"
                  >
                    No rescue evidence entries yet
                  </div>

                  <v-card
                    v-for="(evidence, index) in experimentalEvidence.rescue"
                    :key="`rescue-${index}`"
                    variant="outlined"
                    class="mb-3"
                  >
                    <v-card-text>
                      <EvidenceEntryForm
                        v-model="experimentalEvidence.rescue[index]"
                        :evidence-type="'Rescue'"
                        :max-points="4"
                        @remove="removeEvidence('experimental', 'rescue', index)"
                      />
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-window-item>

        <!-- Contradictory Evidence Tab -->
        <v-window-item value="contradictory">
          <div class="contradictory-evidence">
            <div class="d-flex justify-space-between align-center mb-4">
              <span class="text-subtitle-1">Contradictory Evidence</span>
              <v-btn size="small" color="error" @click="addContradictoryEvidence">
                <v-icon start size="small">mdi-plus</v-icon>
                Add Evidence
              </v-btn>
            </div>

            <v-alert type="info" variant="tonal" class="mb-4" density="compact">
              Contradictory evidence may result in a "Disputed" classification requiring expert
              review.
            </v-alert>

            <div
              v-if="contradictoryEvidence.length === 0"
              class="text-center py-4 text-medium-emphasis"
            >
              No contradictory evidence entries
            </div>

            <v-card
              v-for="(evidence, index) in contradictoryEvidence"
              :key="`contra-${index}`"
              variant="outlined"
              class="mb-3"
            >
              <v-card-text>
                <EvidenceEntryForm
                  v-model="contradictoryEvidence[index]"
                  :evidence-type="'Contradictory'"
                  :allow-negative-points="true"
                  @remove="removeContradictoryEvidence(index)"
                />
              </v-card-text>
            </v-card>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import EvidenceEntryForm from './EvidenceEntryForm.vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({
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
      })
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const activeTab = ref('genetic')

  // Local data
  const geneticEvidence = ref(
    props.modelValue.genetic_evidence || {
      case_level_data: [],
      segregation_data: [],
      case_control_data: []
    }
  )

  const experimentalEvidence = ref(
    props.modelValue.experimental_evidence || {
      function: [],
      models: [],
      rescue: []
    }
  )

  const contradictoryEvidence = ref(props.modelValue.contradictory_evidence || [])

  // Watch for changes and emit updates
  watch(
    [geneticEvidence, experimentalEvidence, contradictoryEvidence],
    () => {
      emit('update:modelValue', {
        genetic_evidence: geneticEvidence.value,
        experimental_evidence: experimentalEvidence.value,
        contradictory_evidence: contradictoryEvidence.value
      })
    },
    { deep: true }
  )

  const getCategoryScore = (evidenceType, category) => {
    const evidence = evidenceType === 'genetic' ? geneticEvidence.value : experimentalEvidence.value
    if (!evidence[category]) return 0
    return evidence[category].reduce((sum, item) => sum + (item.points || 0), 0).toFixed(1)
  }

  const addEvidence = (evidenceType, category) => {
    const evidence = evidenceType === 'genetic' ? geneticEvidence.value : experimentalEvidence.value
    evidence[category].push({
      pmid: '',
      description: '',
      points: 0,
      evidence_type: category.replace('_data', '').replace('_', ' ')
    })
  }

  const removeEvidence = (evidenceType, category, index) => {
    const evidence = evidenceType === 'genetic' ? geneticEvidence.value : experimentalEvidence.value
    evidence[category].splice(index, 1)
  }

  const addContradictoryEvidence = () => {
    contradictoryEvidence.value.push({
      pmid: '',
      description: '',
      points: 0,
      evidence_type: 'contradictory'
    })
  }

  const removeContradictoryEvidence = index => {
    contradictoryEvidence.value.splice(index, 1)
  }
</script>

<style scoped>
  .v-expansion-panel {
    margin-bottom: 8px;
  }

  .v-tab {
    text-transform: none;
  }
</style>
