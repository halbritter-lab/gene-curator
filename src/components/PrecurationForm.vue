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
              </template>
              <template v-else-if="field.style && field.style.curationView === 'text-field' && field.visibility.curationView">
                <v-text-field
                  v-model="precurationData[field.key]"
                  :label="field.label"
                  :class="field.style.curationView === 'text-field' ? 'custom-text-field' : ''"
                ></v-text-field>
              </template>
              <template v-else-if="field.style && field.style.curationView === 'select' && field.visibility.curationView">
                <v-select
                  v-model="precurationData[field.key]"
                  :items="field.options"
                  :label="field.label"
                ></v-select>
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
</template>


<script>
import { precurationDetailsConfig } from '@/config/workflows/KidneyGeneticsGeneCuration/precurationDetailsConfig';
import {
  getPrecurationByHGNCIdOrSymbol,
  createPrecuration,
  updatePrecuration
} from "@/stores/precurationsStore";

export default {
  name: 'PrecurationForm',
  props: {
    approvedSymbol: String,
    hgncId: String,
  },
  data() {
    return {
      precurationData: this.initializePrecurationData(),
      existingPrecurationId: null,
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
  methods: {
    groupHasVisibleFields(group) {
      // This will check if there's at least one field in the group that should be visible
      return group.some(field => field.visibility.curationView);
    },
    initializePrecurationData() {
      const data = {};
      Object.keys(precurationDetailsConfig).forEach(key => {
        data[key] = ''; // Initialize with default value
      });
      return data;
    },
    async submitPrecuration() {
      const currentTime = new Date().toISOString();
      this.precurationData.updatedAt = currentTime;

      if (!this.existingPrecurationId) {
        this.precurationData.createdAt = currentTime;
        const newId = await createPrecuration(this.precurationData);
        // TODO: remove this log and handle the newId
        console.log('New precuration created with ID:', newId);
      } else {
        await updatePrecuration(this.existingPrecurationId, this.precurationData);
        console.log('Precuration updated:', this.existingPrecurationId);
      }

      this.$emit('precuration-accepted', this.precurationData);
    },
    displaySwitchValue(value) {
      return value ? 'Yes' : 'No';
    },
  },
  async created() {
    try {
      const precuration = await getPrecurationByHGNCIdOrSymbol(this.approvedSymbol || this.hgncId);
      if (precuration) {
        this.existingPrecurationId = precuration.id;
        Object.assign(this.precurationData, precuration);
      }
    } catch (error) {
      console.error('Error fetching precuration:', error.message);
    }
  }
};
</script>

<style scoped>
.text-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.inactive-switch {
  --v-theme-switch-on-background: var(--v-theme-inactive-color);
}
/* Additional styles can be added here if needed */
</style>
