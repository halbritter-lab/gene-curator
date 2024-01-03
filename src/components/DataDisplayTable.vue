<!-- components/DataDisplayTable.vue -->
<template>
  <v-data-table
    :headers="headers"
    :items="items"
    density="compact"
  >
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn @click="openModal(item)">Edit</v-btn>
    </template>
  </v-data-table>
    <CurationModal
    v-if="showModal"
    :item="selectedItem"
    :open="showModal"
    @save="saveData"
    @close="closeModal"
  />
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import CurationModal from './CurationModal.vue';
import { getGenes } from '@/stores/store';

export default {
  components: {
    CurationModal,
  },
  setup() {
    const rawItems = ref({});
    const items = computed(() => Object.values(rawItems.value)); // Transform the object into an array

    const headers = [
      { title: 'Approved Symbol', value: 'approved_symbol' },
      { title: 'HGNC ID', value: 'hgnc_id' },
      { title: 'Evidence count', value: 'evidence_count' },
      { title: 'Actions', value: 'actions', sortable: false },
    ];

    const showModal = ref(false);
    const selectedItem = ref(null);

    const openModal = (item) => {
      selectedItem.value = item;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveData = (updatedItem) => {
      console.log(updatedItem);
      // Handle the save operation here...
    };

    onMounted(async () => {
      rawItems.value = await getGenes(); // Fetch data and assign to rawItems
    });

    return {
      items,
      headers,
      showModal,
      selectedItem,
      openModal,
      closeModal,
      saveData,
      getGenes
    };
  },
};
</script>
