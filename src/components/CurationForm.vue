<!-- components/CurationForm.vue -->
<template>
  <v-card class="elevation-2">
    <v-card-title>
      Curation
      <HelpIcon :helpContent="helpContent" />
      <v-btn icon class="add-curation-btn" @click="addCurationEntity">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>

    <!-- Expansion Panels for multiple curation entities -->
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="(curationData, index) in curationDataArray" :key="`curation-${index}`" :title="`Curation Entity ${ index + 1 }`">
          <v-expansion-panel-text>
            <!-- Dynamic Field Rendering Based on Configuration -->
            <template v-for="(group, groupName) in groupedFields" :key="groupName">
              <v-row v-if="groupHasVisibleFields(group)">
                <v-col cols="12">
                  <h2>{{ groupName }}</h2>
                </v-col>
                <v-col
                  v-for="(field, fieldIndex) in group"
                  :key="`field-${index}-${fieldIndex}`"
                  :cols="12 / group.length"
                >

                  <!-- Handle Different Field Types -->
                  <template v-if="field.format === 'text' && field.style && field.style.curationView === 'text-field'">
                    <v-text-field
                      v-model="curationData[field.key]"
                      :rules="getFieldRules(field)"
                      :label="field.label"
                      outlined
                      dense
                    ></v-text-field>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    >
                      {{ field.description }}
                    </v-tooltip>
                  </template>
                  <template v-else-if="field.format === 'boolean'">
                    <v-checkbox
                      v-model="curationData[field.key]"
                      :rules="getFieldRules(field)"
                      :label="field.label"
                    ></v-checkbox>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    >
                      {{ field.description }}
                    </v-tooltip>
                  </template>
                  <template v-else-if="field.format === 'number'">
                    <v-text-field
                      v-model="curationData[field.key]"
                      :rules="getFieldRules(field)"
                      :label="field.label"
                      :min="field.min"
                      :max="field.max"
                      :step="field.step || 1"
                      type="number"
                      outlined
                      dense
                    ></v-text-field>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    >
                      {{ field.description }}
                    </v-tooltip>
                  </template>
                  <template v-else-if="field.format === 'array' && field.style && field.style.curationView === 'select'">
                    <v-select
                      v-model="curationData[field.key]"
                      :rules="getFieldRules(field)"
                      :items="field.options"
                      :label="field.label"
                      multiple
                      outlined
                      dense
                    ></v-select>
                    <v-tooltip
                      activator="parent"
                      location="top"
                    >
                      {{ field.description }}
                    </v-tooltip>
                  </template>
                  <template v-else-if="field.format === 'text' && field.style && field.style.curationView === 'select'">
                    <v-select
                      v-model="curationData[field.key]"
                      :items="field.options"
                      item-value="value"
                      item-text="title"
                      :label="field.label"
                      outlined
                      dense
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
          </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="saveCuration">Save All</v-btn>
    </v-card-actions>
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
import { curationDetailsConfig, workflowConfig, workflowConfigVersion, workflowConfigName } from '@/config/workflows/KidneyGeneticsGeneCuration/workflowConfig';
import {
  createCuration,
  updateCuration,
  getCurationsByHGNCIdOrSymbol
} from "@/stores/curationsStore";
import { required, number, min, max } from '@/utils/validators';
import { updateGeneCurationStatus, getGeneByHGNCIdOrSymbol } from '@/stores/geneStore';
import HelpIcon from './HelpIcon.vue';

export default {
  name: 'CurationForm',
  props: {
    approvedSymbol: String,
    hgncId: String,
    precurationDetails: Object,
  },
  components: {
    HelpIcon,
  },
  data() {
    return {
      curationDataArray: [this.initializeCurationData()],
      existingCurationId: null,
      snackbarVisible: false,
      snackbarMessage: '',
      snackbarTitle: '',
      snackbarColor: 'success',
      helpContent: workflowConfig.stages.curation.helpConfig,
    };
  },
  async created() {
    if (this.hgncId || this.approvedSymbol) {
      try {
        const curations = await getCurationsByHGNCIdOrSymbol(this.hgncId || this.approvedSymbol);
        if (curations.length > 0) {
          this.curationDataArray = curations.map(curation => Object.assign(this.initializeCurationData(), curation));
        } else {
          this.curationDataArray = [this.initializeCurationData()];
        }
      } catch (error) {
        this.showSnackbar('Error', `Error fetching curations: ${error.message}`, 'error');
      }
    } else {
      this.curationDataArray = [this.initializeCurationData()];
    }
  },
  computed: {
    groupedFields() {
      const fields = Object.entries(curationDetailsConfig)
        .map(([key, config]) => ({ ...config, key }));
      
      const groups = {};
      fields.forEach(field => {
        if (!groups[field.group.name]) {
          groups[field.group.name] = [];
        }
        groups[field.group.name].push(field);
      });

      Object.values(groups).forEach(group => {
        group.sort((a, b) => a.group.order - b.group.order);
      });

      return groups;
    },
  },
  methods: {
    getFieldRules(field) {
      const rules = [];
      if (field.required) {
        rules.push(required);
      }
      if (field.format === 'number') {
        rules.push(number);
        if (field.min !== undefined) {
          rules.push(min(field.min));
        }
        if (field.max !== undefined) {
          rules.push(max(field.max));
        }
      }
      return rules;
    }
    ,
    showSnackbar(title, message, color = 'success') {
      this.snackbarTitle = title;
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbarVisible = true;
    },
    groupHasVisibleFields(group) {
      // This will check if there's at least one field in the group that should be visible
      return group.some(field => field.visibility.curationView);
    },
    addCurationEntity() {
      this.curationDataArray.push(this.initializeCurationData());
    },
    initializeCurationData() {
      const data = {};
      Object.keys(curationDetailsConfig).forEach(key => {
        const field = curationDetailsConfig[key];
        if (field.format === 'boolean') {
          data[key] = false;
        } else if (field.format === 'number') {
          data[key] = field.min || 0; // Use min value if defined, otherwise default to 0
        } else if (field.format === 'array' && field.style && field.style.curationView === 'select') {
          data[key] = [];
        } else if (field.format === 'text' && field.style && field.style.curationView === 'select') {
          data[key] = null;
        } else {
          data[key] = '';
        }

        // Prefill approved_symbol and hgnc_id if provided as props
        if (key === 'approved_symbol' && this.approvedSymbol) {
          data[key] = this.approvedSymbol;
        }
        if (key === 'hgnc_id' && this.hgncId) {
          data[key] = this.hgncId;
        }
      });

      // Add precuration data as nested object using document id as key
      if (this.precurationDetails && this.precurationDetails.id) {
        const precurationDocId = this.precurationDetails.id;
        // Creating a nested object with docId as key
        data['precurationDetails'] = { [precurationDocId]: this.precurationDetails };
      }

      return data;
    },
    validateCurationData(curationData) {
      const errors = [];
      for (const [key, field] of Object.entries(curationDetailsConfig)) {
        if (field.required && !curationData[key]) {
          errors.push(`The field "${field.label}" is required.`);
        }
      }
      return errors;
    },
    async saveCuration() {
      const currentUserId = JSON.parse(localStorage.getItem('user')).uid; // Retrieve the current user's ID

      try {
        for (const curationData of this.curationDataArray) {
          // Include the workflow configuration version and name in the curation record
          curationData.workflowConfigVersionUsed = workflowConfigVersion;
          curationData.workflowConfigNameUsed = workflowConfigName;

          let curationDocId = curationData.id; // Get the curation doc ID if it already exists
          let geneDocId; // Declare a variable to store gene document ID

          // If precurationDetails exist, retrieve the geneDocId from the nested geneDetails object
          if (this.precurationDetails && this.precurationDetails.geneDetails) {
            const geneDetailsKeys = Object.keys(this.precurationDetails.geneDetails);
            if (geneDetailsKeys.length > 0) {
              // Assuming geneDetails is an object with a single key that is the geneDocId
              geneDocId = geneDetailsKeys[0];
            }
          }

          // If geneDocId is still not determined, fetch it from the store
          if (!geneDocId) {
            // This function should be created to get the gene document ID based on the gene identifier (approvedSymbol or hgncId)
            geneDocId = await this.getGeneDocIdByGeneIdentifier(this.approvedSymbol || this.hgncId);
          }

          // Update or create the curation document
          if (curationDocId) {
            // Update existing curation
            await updateCuration(curationDocId, curationData, currentUserId, curationDetailsConfig);
            this.showSnackbar('Success', `Curation updated: ${curationDocId}`, 'success');
          } else {
            // Create new curation
            curationDocId = await createCuration(curationData, currentUserId, curationDetailsConfig);
            this.showSnackbar('Success', `New curation created with ID: ${curationDocId}`, 'success');
            curationData.id = curationDocId; // Update the ID in the curation data array
          }

          // Update the gene curation status
          if (geneDocId) {
            await updateGeneCurationStatus(geneDocId, {
              hasCuration: curationDocId,
              curatedBy: currentUserId
            });
          }
        }
      } catch (error) {
        this.showSnackbar('Error', `Error saving curation: ${error.message}`, 'error');
      }
    },
    // Helper function to fetch the gene document ID from the store
    async getGeneDocIdByGeneIdentifier(identifier) {
      const geneData = await getGeneByHGNCIdOrSymbol(identifier);
      return geneData ? geneData.docId : null;
    },
  },
};
</script>


<style scoped>
h2 {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}
.add-curation-btn {
  margin-left: auto; /* pushes the button to the right */
}
</style>
