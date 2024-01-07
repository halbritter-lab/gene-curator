<template>
  <!-- Container for the data table and pagination components -->
  <v-container>
    <!-- Data table with dynamic headers and items -->
    <v-data-table
      :headers="headers"
      :items="paginatedItems"
      v-model:items-per-page="itemsPerPage"
      :server-items-length="totalItems"
      :loading="loading"
      class="elevation-1"
      density="compact"
    >
      <!-- Slot for actions like edit on each item -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn @click="openModal(item)">Edit</v-btn>
      </template>
    </v-data-table>

    <!-- Pagination controls -->
    <v-pagination
      v-model="page"
      :length="totalPages"
    ></v-pagination>

    <!-- Curation Modal for editing items -->
    <CurationModal
      v-if="showModal"
      :item="selectedItem"
      :open="showModal"
      @save="saveData"
      @close="closeModal"
    />
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import CurationModal from './CurationModal.vue';
import { getGenes } from '@/stores/store';

export default {
  components: {
    CurationModal, // Curation modal component
  },
  setup() {
    // State for raw items from the database
    const rawItems = ref({});
    // Loading state to show progress indicator
    const loading = ref(false);

    // State for current page and items per page in pagination
    const page = ref(1);
    const itemsPerPage = ref(10);

    // Computed total number of items and total pages for pagination
    const totalItems = computed(() => Object.keys(rawItems.value).length);
    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

    // Computed property for items to display on the current page
    const paginatedItems = computed(() => {
      const start = (page.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return Object.values(rawItems.value).slice(start, end);
    });

    // Table headers definition
    const headers = [
      { title: 'Approved Symbol', value: 'approved_symbol' },
      { title: 'HGNC ID', value: 'hgnc_id' },
      { title: 'Evidence count', value: 'evidence_count' },
      { title: 'Actions', value: 'actions', sortable: false },
    ];

    // Modal visibility and selected item state
    const showModal = ref(false);
    const selectedItem = ref(null);

    // Functions to handle modal open/close and save operations
    const openModal = (item) => {
      selectedItem.value = item;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveData = (updatedItem) => {
      console.log(updatedItem);
      // TODO: Handle the save operation here...
    };

    // Fetch initial data on mount and set loading state
    onMounted(async () => {
      loading.value = true;
      rawItems.value = await getGenes(); // Fetch data and assign to rawItems
      loading.value = false;
    });

    // Return all reactive states and functions to the template
    return {
      paginatedItems,
      page,
      itemsPerPage,
      totalItems,
      totalPages,
      loading,
      headers,
      showModal,
      selectedItem,
      openModal,
      closeModal,
      saveData,
      getGenes,
    };
  },
};
</script>
