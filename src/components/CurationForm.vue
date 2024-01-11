<!-- components/CurationForm.vue -->
<template>
  <v-card class="elevation-2">
    <v-card-title>Curation</v-card-title>
    <v-card-text>
      <v-container>

        <!-- Entity Section -->
        <v-row class="my-2">
          <v-col cols="12">
            <h2>Entity</h2>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="curationData.approved_symbol"
              label="Approved Symbol"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="curationData.disease"
              label="Disease"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="curationData.inheritance"
              label="Inheritance"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Groups Section -->
        <v-row class="my-2">
          <v-col cols="12">
            <h2>Groups</h2>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="curationData.groups.clinical"
              label="Clinical Group"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <!-- Onset Group should be a select if it's an array -->
            <v-select
              v-model="curationData.groups.onset"
              label="Onset Group"
              :items="[]"
              outlined
              dense
              multiple
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-checkbox
              v-model="curationData.groups.syndromic"
              label="Syndromic"
            ></v-checkbox>
          </v-col>
        </v-row>

        <!-- Points Section -->
        <v-row class="my-2">
          <v-col cols="12">
            <h2>Points</h2>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="curationData.points.variants"
              label="Variants"
              type="number"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="curationData.points.models"
              label="Models"
              type="number"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="curationData.points.functional"
              label="Functional"
              type="number"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="curationData.points.rescue"
              label="Rescue"
              type="number"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <!-- Replication should be a select if it's an array -->
            <v-select
              v-model="curationData.points.replication"
              label="Replication"
              :items="[]"
              outlined
              dense
              multiple
            ></v-select>
          </v-col>
        </v-row>

        <!-- Verdict Section -->
        <v-row class="my-2">
          <v-col cols="12">
            <h2>Verdict</h2>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="curationData.verdict"
              :items="['Definitive', 'Moderate', 'Limited', 'Refuted']"
              label="Verdict"
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="8">
            <v-textarea
              v-model="curationData.comment"
              label="Comment"
              auto-grow
              rows="1"
              no-resize
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="saveCuration">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
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
      curationData: {
        approved_symbol: this.approvedSymbol,
        hgnc_id: this.hgncId,
        disease: '',
        inheritance: '',
        groups: {
          clinical: '',
          onset: [],
          syndromic: false,
        },
        points: {
          variants: 0,
          models: 0,
          functional: 0,
          rescue: 0,
          replication: [],
        },
        verdict: '',
        comment: '',
      },
      existingCurationId: null, // Used to track if we're updating an existing curation
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
  methods: {
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
