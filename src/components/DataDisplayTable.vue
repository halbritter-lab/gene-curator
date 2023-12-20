<template>
  <v-data-table :headers="headers" :items="items">
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn @click="openModal(item)">Edit</v-btn>
    </template>
  </v-data-table>
  <CurationModal v-if="showModal" :item="selectedItem" @save="saveData" @close="showModal = false"/>
</template>

<script>
import CurationModal from './CurationModal.vue';

export default {
  components: {
    CurationModal,
  },
  data() {
    return {
      items: [
        {
          approved_symbol: 'ACE',
          hgnc_id: 2707,
          evidence_count: 5,
          source_count_percentile: 4.257174,
          pLI: 0.000000,
          oe_lof: 0.87460,
          lof_z: 0.97837,
          mis_z: -0.69323,
          // Add more fields from your CSV here...
          cur_id: 'cur_001'
        },
        // Add more dummy rows if needed...
      ],
      headers: [
        { text: 'Approved Symbol', value: 'approved_symbol' },
        { text: 'HGNC ID', value: 'hgnc_id' },
        // Define headers for other fields...
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      showModal: false,
      selectedItem: null,
    };
  },
  methods: {
    openModal(item) {
      this.selectedItem = item;
      this.showModal = true;
    },
    saveData(updatedItem) {
      console.log(updatedItem);
      // Handle the save operation here...
    },
    // Other methods...
  },
};
</script>
