<!-- components/DataDisplayTable.vue -->
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
      <!-- Scoped slot for the 'Approved Symbol' column -->
      <template v-slot:[`item.approved_symbol`]="{ item }">
        <router-link :to="`/gene/${item.hgnc_id}`">{{ item.approved_symbol }}</router-link>
      </template>

      <!-- Scoped slot for the 'HGNC ID' column -->
      <template v-slot:[`item.hgnc_id`]="{ item }">
        <router-link :to="`/gene/${item.hgnc_id}`">{{ item.hgnc_id }}</router-link>
      </template>

      <!-- Slot for actions like edit on each item -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn v-if="isLoggedIn" @click="openModal(item)">Curate</v-btn>
      </template>
    </v-data-table>

    <!-- Pagination controls -->
    <v-pagination
      v-model="page"
      :length="totalPages"
    ></v-pagination>

    <!-- Data export component -->
    <data-export :data-to-export="exportableItems" filename="my-genes-data" />

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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import CurationModal from './CurationModal.vue';
import DataExport from '@/components/DataExport.vue';
import { getGenes } from '@/stores/geneStore';


export default {
  components: {
    CurationModal, // Curation modal component
    DataExport, // Data export component
  },
  setup() {
    // State for raw items from the database
    const rawItems = ref({});

    // Computed property that transforms rawItems into an array for export
    const exportableItems = computed(() => {
      return Object.values(rawItems.value);
    });

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

    const auth = getAuth(); // Get Firebase auth instance
    const user = ref(null); // Reactive property for the current user

    // Computed property to determine if user is logged in
    const isLoggedIn = computed(() => !!user.value);

    // Listen for auth state changes
    onAuthStateChanged(auth, (loggedInUser) => {
      user.value = loggedInUser;
    });

    // ... existing functions like openModal, closeModal, etc. ...

    onMounted(async () => {
      loading.value = true;
      rawItems.value = await getGenes();
      loading.value = false;
    });

    // Fetch initial data on mount and set loading state
    onMounted(async () => {
      loading.value = true;
      rawItems.value = await getGenes(); // Fetch data and assign to rawItems
      loading.value = false;
    });

    // Return all reactive states and functions to the template
    return {
      exportableItems,
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
      isLoggedIn
    };
  },
};
</script>
