<!-- components/CurationForm.vue -->
<template>
  <v-card class="elevation-2">
    <v-card-title>
      Curation
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
</template>


<script>
import { curationDetailsConfig } from '@/config/workflows/KidneyGeneticsGeneCuration/curationDetailsConfig';
import { workflowConfigVersion, workflowConfigName } from '@/config/workflows/KidneyGeneticsGeneCuration/workflowConfig';
import {
  createCuration,
  updateCuration,
  getCurationsByHGNCIdOrSymbol
} from "@/stores/curationsStore";

export default {
  name: 'CurationForm',
  props: {
    approvedSymbol: String,
    hgncId: String,
  },
  data() {
    return {
      curationDataArray: [this.initializeCurationData()],
      existingCurationId: null,
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
        console.error('Error fetching curations:', error.message);
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

          if (curationData.id) {
            // Update existing curation
            await updateCuration(curationData.id, curationData, currentUserId, curationDetailsConfig);
            console.log('Curation updated:', curationData.id);
          } else {
            // Create new curation
            const newId = await createCuration(curationData, currentUserId, curationDetailsConfig);
            console.log('New curation created with ID:', newId);
            curationData.id = newId; // Update the ID in the curation data array
          }
        }
      } catch (error) {
        console.error('Error saving curation:', error.message);
      }
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
