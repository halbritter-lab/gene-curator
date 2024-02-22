<!-- components/PrecurationForm.vue -->
<template>
  <v-card class="elevation-2">
    <v-card-title>Precuration</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col
            v-for="(option, index) in precurationOptions"
            :key="index"
            cols="2"
            class="text-center"
          >
            <v-switch
              v-model="precurationData[option.key]"
              :false-value="false"
              :true-value="true"
              hide-details
              class="mt-0"
              :color="precurationData[option.key] ? option.activeColor : 'grey'"
            ></v-switch>
            <div :style="{ color: option.color }">
              {{ option.label }}: {{ displaySwitchValue(precurationData[option.key]) }}
            </div>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-center">
            <v-divider vertical class="mx-2"></v-divider>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="precurationData.decision"
              :items="['Split', 'Lump']"
              label="Decision"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-textarea
              v-model="precurationData.comment"
              label="Comment"
              auto-grow
              rows="1"
              no-resize
            ></v-textarea>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-center">
            <v-divider vertical class="mx-2"></v-divider>
          </v-col>
          <v-col cols="3" class="pt-2 d-flex align-center">
            <!-- Updated button with icon -->
            <v-btn color="primary" @click="submitPrecuration">
              Accept <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
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
      precurationData: {
        approved_symbol: this.approvedSymbol,
        hgnc_id: this.hgncId,
        entity_assertion: false,
        inheritance_difference: false,
        mechanism_difference: false,
        phenotypic_variability: false,
        decision: '',
        comment: '',
        createdAt: null, // Will be set when accept is clicked
        updatedAt: null, // Will be set when accept is clicked
        users: ['user1'], // Mock user values
      },
      precurationOptions: [
        { key: 'entity_assertion', label: 'Assertion', color: 'purple', activeColor: 'indigo' },
        { key: 'inheritance_difference', label: 'Inheritance', color: 'green', activeColor: 'lime' },
        { key: 'mechanism_difference', label: 'Mechanism', color: 'red', activeColor: 'orange' },
        { key: 'phenotypic_variability', label: 'Variability', color: 'blue', activeColor: 'cyan' },
      ],
      existingPrecurationId: null,
    };
  },
  methods: {
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

/* Additional styles can be added here if needed */
</style>
