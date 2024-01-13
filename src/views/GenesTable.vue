<!-- views/GenesTable.vue -->
<template>
  <v-container>
    <h1>Data Table View</h1>
    <DataDisplayTable
      :headers="headers"
      :items="paginatedItems"
      :config="tableConfig"
      :total-items="totalItems"
      :loading="loading"
      :is-logged-in="isLoggedIn"
      @action="handleAction"
      @page-changed="updatePage"
      @items-per-page-changed="updateItemsPerPage"
    >
      <template v-slot:action-slot="{ item }">
        <v-btn @click="openModal(item)">Curate</v-btn>
      </template>

      <template v-slot:modal>
        <CurationModal :item="selectedItem" :open="showModal" @close="closeModal" @save="saveData" />
      </template>
    </DataDisplayTable>
  </v-container>
</template>


<script>
import { ref, onMounted, computed } from 'vue';
import DataDisplayTable from '@/components/DataDisplayTable.vue';
import { getGenes } from '@/stores/geneStore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import CurationModal from '@/components/CurationModal.vue';

/**
 * GenesTable component responsible for displaying gene data in a table format.
 * It handles pagination, modal display, and custom actions.
 */
export default {
  name: 'GenesTable',
  components: {
    DataDisplayTable,
    CurationModal
  },
  setup() {
    // State for raw gene data and UI states
    const rawItems = ref({});
    const loading = ref(false);
    const page = ref(1);
    const itemsPerPage = ref(10);

    // Firebase auth setup
    const auth = getAuth();
    const user = ref(null);

    // Modal control state
    const showModal = ref(false);
    const selectedItem = ref({});

    // Computed properties for UI
    const isLoggedIn = computed(() => !!user.value);
    const totalItems = computed(() => Object.keys(rawItems.value).length);
    const paginatedItems = computed(() => {
      // Compute the slice of data to display based on current page and items per page
      const start = (page.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return Object.values(rawItems.value).slice(start, end);
    });

    const headers = [
      { title: 'Approved Symbol', value: 'approved_symbol' },
      { title: 'HGNC ID', value: 'hgnc_id' },
      { title: 'Evidence count', value: 'evidence_count' },
      { title: 'Actions', value: 'actions', sortable: false },
    ];

    const tableConfig = {
      columns: [
        {
          name: 'approved_symbol',
          type: 'link', // Types can be 'text', 'link', 'action', etc.
          to: item => `/gene/${item.hgnc_id}` // Function to generate the link
        },
        {
          name: 'hgnc_id',
          type: 'text'
        },
        {
          name: 'actions',
          type: 'slot',
          slotName: 'action-slot'
        }
      ]
    };

    // Function to handle modal opening
    const openModal = (item) => {
      selectedItem.value = item;
      showModal.value = true;
    };

    // Function to handle modal closure
    const closeModal = () => {
      showModal.value = false;
    };
    
    // Function to handle saving data from the modal
    const saveData = (updatedItem) => {
      // TODO: Implement the logic to save the updated item
      console.log('Saving data:', updatedItem);
    };
    
    // Function to handle actions triggered from the table
    const handleAction = (item) => {
      // TODO: Implement additional actions if needed
      console.log('Action for item:', item);
    };
    
    // Pagination control functions
    const updatePage = (newPage) => {
      page.value = newPage;
    };
    
    const updateItemsPerPage = (newItemsPerPage) => {
      itemsPerPage.value = newItemsPerPage;
    };
    
    // Fetch gene data and listen for auth state changes
    onMounted(async () => {
      loading.value = true;
      rawItems.value = await getGenes(); // Fetch gene data
      loading.value = false;
    });
    
    onAuthStateChanged(auth, (loggedInUser) => {
      user.value = loggedInUser; // Update user state on auth change
    });
    
    // Exposing reactive states and functions to the template
    return {
      headers,
      paginatedItems,
      tableConfig,
      totalItems,
      loading,
      isLoggedIn,
      showModal,
      selectedItem,
      openModal,
      closeModal,
      saveData,
      updatePage,
      updateItemsPerPage,
      handleAction
    };
  },
};
</script>
