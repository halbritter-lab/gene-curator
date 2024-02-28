<!-- components/CurationForm.vue -->
<template>
  <v-card class="elevation-2">
    <v-card-title>Curation</v-card-title>
    <v-card-text>
      <v-container>
        <!-- Dynamic Field Rendering Based on Configuration -->
        <template v-for="(group, groupName) in groupedFields" :key="groupName">
          <v-row v-if="groupHasVisibleFields(group)">
            <v-col cols="12">
              <h2>{{ groupName }}</h2>
            </v-col>
            <v-col 
              v-for="(field, index) in group" 
              :key="index" 
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
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="saveCuration">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
import { curationDetailsConfig } from '@/config/workflows/KidneyGeneticsGeneCuration/curationDetailsConfig';
import {
  createCuration,
  updateCuration,
  getCurationByHGNCIdOrSymbol
} from "@/stores/curationsStore";

export default {
  name: 'CurationForm',
  props: {
    approvedSymbol: String,
    hgncId: String,
  },
  data() {
    return {
      curationData: this.initializeCurationData(),
      existingCurationId: null,
    };
  },
  async created() {
    if (this.hgncId || this.approvedSymbol) {
      try {
        const curation = await getCurationByHGNCIdOrSymbol(this.hgncId || this.approvedSymbol);
        if (curation) {
          this.existingCurationId = curation.id;
          Object.assign(this.curationData, curation);
        }
      } catch (error) {
        console.error('Error fetching curation:', error.message);
      }
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
      });
      return data;
    },
    async saveCuration() {
      try {
        if (this.existingCurationId) {
          // Update the existing curation
          await updateCuration(this.existingCurationId, this.curationData);
          console.log('Curation updated:', this.existingCurationId);
        } else {
          // Create a new curation
          const newId = await createCuration(this.curationData);
          console.log('New curation created with ID:', newId);
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
</style>
