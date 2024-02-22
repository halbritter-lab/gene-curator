<!-- views/GenesTable.vue -->
<template>
  <v-container>
    <h1>Genes Table</h1>

    <!-- Data export component -->
    <DataExport 
      :data-to-export="paginatedItems" 
      filename="GenesDataExport"
    />

    <!-- Data table component -->
    <DataDisplayTable
      :headers="headers"
      :items="paginatedItems"
      :config="tableConfig"
      :total-items="totalItems"
      :loading="loading"
      @action="handleAction"
      @page-changed="updatePage"
      @items-per-page-changed="updateItemsPerPage"
    >
      <template v-slot:action-slot="{ item }" v-if="isCuratorOrAdmin">
        <v-btn @click="openModal(item)">Curate</v-btn>
      </template>

      <template v-slot:modal>
        <CurationModal :item="selectedItem" :open="showModal" @close="closeModal" />
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
import DataExport from '@/components/DataExport.vue';
import { geneDetailsConfig } from '@/config/workflows/KidneyGeneticsGeneCuration/workflowConfig';

/**
 * GenesTable component responsible for displaying gene data in a table format.
 * It handles pagination, modal display, and custom actions.
 */
export default {
  name: 'GenesTable',
  components: {
    DataDisplayTable,
    CurationModal,
    DataExport
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

    // Dynamically define headers based on user role and
    // create headers dynamically based on the geneDetailsConfig
    const headers = computed(() => {
      const dynamicHeaders = Object.entries(geneDetailsConfig)
        .filter(([, config]) => config.visibility.tableView)
        .map(([key, config]) => ({
          title: config.label,
          value: key,
          sortable: config.format !== 'array' && config.format !== 'map',
          description: config.description // Add the description for the tooltip
        }));

      // Add 'Actions' header if user is curator or admin
      if (isCuratorOrAdmin.value) {
        dynamicHeaders.push({ title: 'Actions', value: 'actions', sortable: false });
      }

      return dynamicHeaders;
    });

    const tableConfig = {
      columns: [
        {
          name: 'approved_symbol',
          type: 'link', // Types can be 'text', 'link', 'action', etc.
          to: item => `/gene/${item.hgnc_id}` // Function to generate the link
        },
        {
          name: 'evidence_count',
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

    // Computed property to check if the user is a curator or admin
    const isCuratorOrAdmin = computed(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && (user.role === 'curator' || user.role === 'admin');
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
      updatePage,
      updateItemsPerPage,
      handleAction,
      isCuratorOrAdmin
    };
  },
};
</script>
