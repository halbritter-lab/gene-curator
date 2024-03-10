<!-- components/PrecurationForm.vue -->
<template>
  <v-card class="elevation-2">
    <v-card-title>Precuration</v-card-title>
    <v-card-text>
      <v-container>
        <!-- Group the fields by the group attribute -->
        <template v-for="(group, groupName) in groupedFields" :key="groupName">
          <v-row v-if="groupHasVisibleFields(group)">
            <v-col cols="12">
              <h2>{{ groupName }}</h2>
            </v-col>
            <!-- Loop over fields within the same group and place them in columns -->
            <v-col 
              v-for="(field, index) in group" 
              :key="index" 
              :cols="12 / group.length"
            >
              <template v-if="field.format === 'boolean' && field.visibility.curationView">
                <v-switch
                  v-model="precurationData[field.key]"
                  :label="field.label"
                  :false-value="false"
                  :true-value="true"
                  :color="field.style.curationView === 'switch' ? field.style.color : ''"
                  :class="{ 'inactive-switch': !precurationData[field.key] && field.style.curationView === 'switch' }"
                ></v-switch>
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  {{ field.description }}
                </v-tooltip>
              </template>
              <template v-else-if="field.style && field.style.curationView === 'text-field' && field.visibility.curationView">
                <v-text-field
                  v-model="precurationData[field.key]"
                  :label="field.label"
                  :class="field.style.curationView === 'text-field' ? 'custom-text-field' : ''"
                ></v-text-field>
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  {{ field.description }}
                </v-tooltip>
              </template>
              <template v-else-if="field.style && field.style.curationView === 'select' && field.visibility.curationView">
                <v-select
                  v-model="precurationData[field.key]"
                  :items="field.options"
                  :label="field.label"
                  :class="{
                    'prefilled-field': decisionPrefilled && field.key === 'decision',
                    'manually-changed-field': decisionManuallyChanged && field.key === 'decision'
                  }"
                ></v-select>
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  {{ field.description }}
                </v-tooltip>
              </template>
              <!-- Add other field types as needed -->
            </v-col>
          </v-row>
        </template>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn color="primary" @click="submitPrecuration">Accept</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>

  <!-- message snackbar component -->
  <MessageSnackbar
    v-model="snackbarVisible"
    :title="snackbarTitle"
    :message="snackbarMessage"
    :color="snackbarColor"
  />
</template>


<script>
import { precurationDetailsConfig, workflowConfig, workflowConfigVersion, workflowConfigName } from '@/config/workflows/KidneyGeneticsGeneCuration/workflowConfig';
import {
  getPrecurationByHGNCIdOrSymbol,
  createPrecuration,
  updatePrecuration
} from "@/stores/precurationsStore";
import { geneDetailsConfig } from '@/config/workflows/KidneyGeneticsGeneCuration/workflowConfig';

export default {
  name: 'PrecurationForm',
  props: {
    geneObject: Object,
  },
  emits: ['precuration-accepted'],
  components: {
  },
  data() {
    return {
      precurationData: this.initializePrecurationData(),
      existingPrecurationId: null,
      decisionPrefilled: false,
      decisionManuallyChanged: false,
      snackbarVisible: false,
      snackbarMessage: '',
      snackbarTitle: '',
      snackbarColor: 'success',
    };
  },
  computed: {
    groupedFields() {
      const fields = this.precurationFields;
      const groups = {};

      // Group fields by their 'group.name'
      fields.forEach(field => {
        if (!groups[field.group.name]) {
          groups[field.group.name] = [];
        }
        groups[field.group.name].push(field);
      });

      // Sort groups by 'group.order'
      Object.values(groups).forEach(group => {
        group.sort((a, b) => a.group.order - b.group.order);
      });

      return groups;
    },
    precurationFields() {
      let fields = Object.entries(precurationDetailsConfig)
        .map(([key, config]) => ({ ...config, key }));
      return fields;
    },
  },
  watch: {
    precurationData: {
      deep: true,
      handler() {
        this.applyDecisionRules();
      }
    },
    'precurationData.decision': 'onDecisionChange',
  },
  methods: {
    showSnackbar(title, message, color = 'success') {
      this.snackbarTitle = title;
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbarVisible = true;
    },
    applyDecisionRules() {
      const decisionRule = workflowConfig.stages.precuration.decisionRules[0];
      let trueCount = decisionRule.conditions.reduce((count, condition) => 
        this.precurationData[condition] ? count + 1 : count, 0);

      if (trueCount >= decisionRule.threshold) {
        // Apply prefilled decision only if the current decision matches the computed decision or is empty
        if (this.precurationData.decision === decisionRule.decision || !this.precurationData.decision) {
          this.precurationData.decision = decisionRule.decision;
          this.decisionPrefilled = true;
          this.decisionManuallyChanged = false;
        }
      } else {
        // If conditions are not met and the decision was prefilled, reset the decision prefilled status
        if (this.decisionPrefilled) {
          this.decisionPrefilled = false;
        }
      }
    },
    onDecisionChange(newValue) {
      const decisionRule = workflowConfig.stages.precuration.decisionRules[0];
      let trueCount = decisionRule.conditions.reduce((count, condition) => 
        this.precurationData[condition] ? count + 1 : count, 0);

      const computedDecision = trueCount >= decisionRule.threshold ? decisionRule.decision : '';

      this.decisionManuallyChanged = newValue !== computedDecision;

      if (this.decisionManuallyChanged) {
        this.updateCommentField("Decision manually overridden.");
      } else {
        this.removeCommentOverride();
      }
    },
    updateCommentField(overrideMessage) {
      if (!this.precurationData.comment.includes(overrideMessage)) {
        this.precurationData.comment += (this.precurationData.comment ? " " : "") + overrideMessage;
      }
    },
    removeCommentOverride() {
      const overrideMessage = "Decision manually overridden.";
      if (this.precurationData.comment.includes(overrideMessage)) {
        this.precurationData.comment = this.precurationData.comment.replace(overrideMessage, "").trim();
      }
    },
    groupHasVisibleFields(group) {
      // This will check if there's at least one field in the group that should be visible
      return group.some(field => field.visibility.curationView);
    },
    initializePrecurationData() {
      const data = {};
      Object.keys(precurationDetailsConfig).forEach(key => {
        if (this.geneObject && key in this.geneObject) {
          data[key] = this.geneObject[key];
        } else {
          data[key] = precurationDetailsConfig[key].format === 'boolean' ? false : '';
        }
      });

      // Handling geneDetails as a nested object with the gene document ID as key
      if (this.geneObject && this.geneObject.docId) {
        const geneDocId = this.geneObject.docId;
        const geneDetails = {};

        // Populate geneDetails with relevant information from geneObject
        Object.keys(geneDetailsConfig).forEach(detailKey => {
          if (detailKey in this.geneObject) {
            geneDetails[detailKey] = this.geneObject[detailKey];
          }
        });

        // Set geneDetails with geneDocId as key
        data['geneDetails'] = { [geneDocId]: geneDetails };
      }

      return data;
    },
    validatePrecurationData(precurationData) {
      const errors = [];
      for (const [key, field] of Object.entries(precurationDetailsConfig)) {
        if (field.required && (precurationData[key] === undefined || precurationData[key] === '')) {
          errors.push(`The field "${field.label}" is required.`);
        }
      }
      return errors;
    },
    async submitPrecuration() {
      const currentUserId = JSON.parse(localStorage.getItem('user')).uid;

      try {
        // Validate the precuration data
        const validationErrors = this.validatePrecurationData(this.precurationData, precurationDetailsConfig);
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join(' ')}`);
        }

        // Add timestamps for creation or update
        const currentTime = new Date().toISOString();
        let docId;
        if (!this.existingPrecurationId) {
          // If creating a new precuration
          this.precurationData.createdAt = currentTime;
          this.precurationData.workflowConfigVersionUsed = workflowConfigVersion;
          this.precurationData.workflowConfigNameUsed = workflowConfigName;
          docId = await createPrecuration(this.precurationData, currentUserId, precurationDetailsConfig);
          this.precurationData.docId = docId; // Add docId to precurationData
          this.showSnackbar('Success', 'New precuration created with ID:' + docId, 'success');
        } else {
          // If updating an existing precuration
          this.precurationData.updatedAt = currentTime;
          await updatePrecuration(this.existingPrecurationId, this.precurationData, currentUserId, precurationDetailsConfig);
          docId = this.existingPrecurationId;
          this.showSnackbar('Success', 'Precuration updated' + this.existingPrecurationId, 'success');
        }

        // Emit an event to indicate successful submission, including the docId
        this.$emit('precuration-accepted', { docId, ...this.precurationData });
      } catch (error) {
        this.showSnackbar('Error', error.message || "There was an error submitting the precuration", 'error');
      }
    },
    displaySwitchValue(value) {
      return value ? 'Yes' : 'No';
    },
  },
  async created() {
    // Ensure geneObject is available and has the necessary properties
    if (this.geneObject && (this.geneObject.approved_symbol || this.geneObject.hgnc_id)) {
      try {
        // Use geneObject's approved_symbol or hgnc_id for the query
        const identifier = this.geneObject.approved_symbol || this.geneObject.hgnc_id;
        const precuration = await getPrecurationByHGNCIdOrSymbol(identifier);

        if (precuration) {
          this.existingPrecurationId = precuration.id;
          Object.assign(this.precurationData, precuration);
        }
      } catch (error) {
        this.showSnackbar('Error', 'Error fetching precuration: ' + error.message, 'error');
      }
    }
  }
};
</script>

<style scoped>
/* Custom styles for text fields */
.text-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Custom styles for text fields */
.inactive-switch {
  --v-theme-switch-on-background: var(--v-theme-inactive-color);
}

/* Style for prefilled fields */
.prefilled-field {
  border: 2px solid orange; /* Orange border for prefilled fields */
  /* Other styles as needed */
}

/* Style for manually changed fields */
.manually-changed-field {
  border: 2px solid purple; /* Purple border for manually changed fields */
  /* Other styles as needed */
}
/* Additional styles can be added here if needed */
</style>
