<template>
  <v-form ref="formRef" @submit.prevent="handleFormSubmit">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="text-h5 mb-4">
            <v-icon start>mdi-clipboard-text</v-icon>
            {{ isEditing ? 'Edit' : 'Create' }} Pre-curation
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
            :disabled="isEditing"
            return-object
            @update:model-value="onGeneSelected"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.raw.approved_symbol }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.hgnc_id }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.mondo_id"
            label="MONDO ID *"
            placeholder="MONDO:0000001"
            variant="outlined"
            :rules="mondoIdRules"
          >
            <template #append-inner>
              <v-btn
                v-if="formData.mondo_id"
                icon
                size="x-small"
                variant="text"
                :href="`https://monarchinitiative.org/disease/${formData.mondo_id}`"
                target="_blank"
              >
                <v-icon size="small">mdi-open-in-new</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.mode_of_inheritance"
            :items="inheritanceModes"
            label="Mode of Inheritance *"
            variant="outlined"
            :rules="requiredRules"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="formData.lumping_splitting_decision"
            :items="decisionOptions"
            label="Lumping/Splitting Decision"
            variant="outlined"
            :hint="decisionHint"
            persistent-hint
          />
        </v-col>
      </v-row>

      <!-- Rationale -->
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="formData.rationale"
            label="Rationale"
            placeholder="Provide rationale for the lumping/splitting decision and pre-curation assessment..."
            variant="outlined"
            rows="4"
            auto-grow
            :rules="rationaleRules"
          />
        </v-col>
      </v-row>

      <!-- ClinGen Guidance -->
      <v-row>
        <v-col cols="12">
          <v-card variant="tonal" color="info">
            <v-card-title class="text-subtitle-1">
              <v-icon start>mdi-information</v-icon>
              ClinGen Pre-curation Guidance
            </v-card-title>
            <v-card-text class="text-body-2">
              <p class="mb-2">
                <strong>Lumping:</strong> Multiple phenotypes or disease names represent the same
                underlying genetic condition.
              </p>
              <p class="mb-2">
                <strong>Splitting:</strong> What appears to be one condition actually represents
                multiple distinct genetic entities.
              </p>
              <p class="mb-0">
                <strong>Undecided:</strong> More evidence is needed to make a lumping/splitting
                determination.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Gene Information (if selected) -->
      <v-row v-if="selectedGene">
        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-title class="text-subtitle-1">
              <v-icon start>mdi-dna</v-icon>
              Selected Gene Information
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="3">
                  <div class="text-caption text-medium-emphasis">Gene Symbol</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ selectedGene.approved_symbol }}
                  </div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="text-caption text-medium-emphasis">HGNC ID</div>
                  <div class="text-body-1">{{ selectedGene.hgnc_id }}</div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="text-caption text-medium-emphasis">Chromosome</div>
                  <div class="text-body-1">{{ selectedGene.chromosome || 'Unknown' }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Status (for editing) -->
      <v-row v-if="isEditing">
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.status"
            :items="availableStatusOptions"
            label="Status"
            variant="outlined"
            :disabled="!canChangeStatus"
          />
        </v-col>
      </v-row>

      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12" class="d-flex justify-end gap-3">
          <v-btn variant="outlined" @click="$emit('cancel')"> Cancel </v-btn>

          <v-btn
            v-if="!isEditing"
            variant="outlined"
            color="primary"
            :loading="saving"
            @click="saveDraft"
          >
            Save as Draft
          </v-btn>

          <v-btn color="primary" type="submit" :loading="saving">
            {{ isEditing ? 'Update Pre-curation' : 'Create Pre-curation' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useGenesStore, usePrecurationsStore, useAuthStore } from '@/stores'
  import { showError, showSuccess } from '@/composables/useNotifications.js'

  const props = defineProps({
    precuration: {
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

  const genesStore = useGenesStore()
  const precurationsStore = usePrecurationsStore()
  const authStore = useAuthStore()

  const isEditing = computed(() => !!props.precuration)
  const canChangeStatus = computed(() => authStore.isAdmin)

  // Form data
  const formData = ref({
    gene_id: props.geneId || null,
    mondo_id: '',
    mode_of_inheritance: 'Autosomal Dominant',
    lumping_splitting_decision: 'Undecided',
    rationale: '',
    status: 'Draft',
    details: {}
  })

  // Initialize form with existing precuration data
  if (props.precuration) {
    Object.assign(formData.value, props.precuration)
  }

  const availableGenes = ref([])
  const selectedGene = ref(null)

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

  const decisionOptions = [
    { title: 'Lump - Same genetic condition', value: 'Lump' },
    { title: 'Split - Distinct genetic entities', value: 'Split' },
    { title: 'Undecided - More evidence needed', value: 'Undecided' }
  ]

  const availableStatusOptions = computed(() => {
    const baseOptions = [
      { title: 'Draft', value: 'Draft' },
      { title: 'In Primary Review', value: 'In_Primary_Review' },
      { title: 'In Secondary Review', value: 'In_Secondary_Review' },
      { title: 'Approved', value: 'Approved' },
      { title: 'Rejected', value: 'Rejected' }
    ]

    // Only allow 'Published' if the current status is 'Approved'
    if (isEditing.value && formData.value.status === 'Approved') {
      baseOptions.splice(-1, 0, { title: 'Published', value: 'Published' })
    }

    return baseOptions
  })

  const decisionHint = computed(() => {
    const hints = {
      Lump: 'Multiple disease names represent the same condition',
      Split: 'One apparent condition is actually multiple distinct entities',
      Undecided: 'More evidence is needed to make a determination'
    }
    return hints[formData.value.lumping_splitting_decision] || ''
  })

  // Validation rules
  const requiredRules = [value => !!value || 'This field is required']

  const mondoIdRules = [
    value => !!value || 'MONDO ID is required',
    value => /^MONDO:\d+$/.test(value) || 'MONDO ID must be in format MONDO:######'
  ]

  const rationaleRules = [
    value => !!value || 'Rationale is required',
    value => value.length >= 50 || 'Rationale must be at least 50 characters'
  ]

  // Watch for gene selection
  watch(
    () => formData.value.gene_id,
    newGeneId => {
      if (newGeneId && typeof newGeneId === 'object') {
        selectedGene.value = newGeneId
        formData.value.gene_id = newGeneId.id
      } else if (newGeneId) {
        // Find gene in available genes
        const gene = availableGenes.value.find(g => g.id === newGeneId)
        if (gene) {
          selectedGene.value = gene
        }
      }
    }
  )

  const onGeneSelected = gene => {
    selectedGene.value = gene
    if (gene) {
      formData.value.gene_id = gene.id
    }
  }

  const loadGenes = async () => {
    try {
      genesLoading.value = true
      await genesStore.fetchSummary()
      availableGenes.value = genesStore.summary

      // If editing and gene_id exists, find the selected gene
      if (props.precuration?.gene_id) {
        selectedGene.value = availableGenes.value.find(g => g.id === props.precuration.gene_id)
      }
    } catch (error) {
      showError('Failed to load genes')
    } finally {
      genesLoading.value = false
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

  const handleFormSubmit = async () => {
    // Use the form data status or default to 'Draft'
    const status = isEditing.value ? formData.value.status : 'Draft'
    await handleSubmit(status)
  }

  const handleSubmit = async (status = 'Draft') => {
    try {
      saving.value = true

      const isValid = await formRef.value.validate()
      if (!isValid.valid) {
        showError('Please fix validation errors before submitting')
        return
      }

      const precurationData = {
        gene_id: selectedGene.value?.id || formData.value.gene_id,
        mondo_id: formData.value.mondo_id,
        mode_of_inheritance: formData.value.mode_of_inheritance,
        lumping_splitting_decision: formData.value.lumping_splitting_decision,
        rationale: formData.value.rationale,
        status,
        details: formData.value.details || {}
      }

      let result
      if (isEditing.value) {
        result = await precurationsStore.updatePrecuration(props.precuration.id, precurationData)
        showSuccess('Pre-curation updated successfully')
      } else {
        result = await precurationsStore.createPrecuration(precurationData)
        showSuccess('Pre-curation created successfully')
      }

      emit('submit', result)
      emit('saved', result)
    } catch (error) {
      showError(error.message || 'Failed to save pre-curation')
    } finally {
      saving.value = false
    }
  }

  onMounted(() => {
    loadGenes()
  })
</script>

<style scoped>
  .gap-3 {
    gap: 12px;
  }
</style>
