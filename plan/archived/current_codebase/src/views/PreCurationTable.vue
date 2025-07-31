<!--components/PreCurationTable.vue-->
<template>
  <v-container>
    <h1>Pre-Curation Table</h1>

    <!-- Data table component -->
    <DataDisplayTable
      :headers="headers"
      :items="paginatedItems"
      :config="tableConfig"
      :total-items="totalItems"
      :loading="loading"
      @page-changed="updatePage"
      @items-per-page-changed="updateItemsPerPage"
    >

      <template v-slot:action-slot="{ item }" v-if="isCuratorOrAdmin">
        <v-btn color="primary" @click="openModal(item)">Edit</v-btn>
        <v-btn color="green" @click="approveItem(item)">
          <v-icon left v-if="item.approvedBy">mdi-check</v-icon>
          Approve
        </v-btn>
        <v-btn color="error" @click="deleteItem(item)">Delete</v-btn>
      </template>

      <template v-slot:modal>
        <CurationModal :item="selectedItem" :open="showModal" context="precuration" @close="closeModal" />
      </template>

    </DataDisplayTable>

    <ConfirmationModal
      :visible="confirmModalVisible"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import DataDisplayTable from '@/components/DataDisplayTable.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import CurationModal from '@/components/CurationModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { getPrecurations, deletePrecuration, updatePrecuration } from '@/stores/precurationsStore';
import { precurationDetailsConfig } from '@/config/workflows/KidneyGeneticsGeneCuration/workflowConfig';

export default {
  name: 'PreCurationTable',
  components: {
    DataDisplayTable,
    CurationModal,
    ConfirmationModal
  },
  setup() {
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
      const start = (page.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return Object.values(rawItems.value).slice(start, end);
    });

    // Dynamically define headers based on user role and
    // create headers dynamically based on the precurationDetailsConfig
    const headers = computed(() => {
      const dynamicHeaders = Object.entries(precurationDetailsConfig)
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
          name: 'createdAt',
          type: 'date'
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

    const updatePage = (newPage) => {
      page.value = newPage;
    };

    const updateItemsPerPage = (newItemsPerPage) => {
      itemsPerPage.value = newItemsPerPage;
    };

    const confirmModalVisible = ref(false);
    const confirmModalTitle = ref('');
    const confirmModalMessage = ref('');
    let currentAction = null;

    const openConfirmModal = (title, message, action) => {
      confirmModalTitle.value = title;
      confirmModalMessage.value = message;
      currentAction = action;
      confirmModalVisible.value = true;
    };

    const onConfirm = () => {
      if (currentAction) {
        currentAction();
      }
      confirmModalVisible.value = false;
    };

    const onCancel = () => {
      confirmModalVisible.value = false;
    };

    // Function for updating the local state after an item is deleted or approved
    const updateLocalState = (itemId, updatedData = null) => {
      if (updatedData) {
        // Update the item data if it exists (for approval)
        rawItems.value[itemId] = updatedData;
      } else {
        // Delete the item from the local state (for deletion)
        delete rawItems.value[itemId];
      }
      // Trigger reactivity
      rawItems.value = {...rawItems.value};
    };

    // Function to delete an item
    const deleteItem = async (item) => {
      openConfirmModal(
        'Delete Precuration',
        'Are you sure you want to delete this precuration?',
        async () => {
          if (item && item.id) {
            await deletePrecuration(item.id);
            updateLocalState(item.id);
          } else {
            console.error('Item ID is undefined or invalid');
          }
        }
      );
    };

    // Function to approve an item
    const approveItem = async (item) => {
      openConfirmModal(
        'Approve Precuration',
        'Are you sure you want to approve this precuration?',
        async () => {
          if (item && item.id && user.value) {
            const updatedData = {
              ...item,
              approvedBy: user.value.uid, // Assuming you have the user's UID here
              approvedAt: new Date().toISOString()
            };
            await updatePrecuration(item.id, updatedData, user.value.uid, precurationDetailsConfig);
            updateLocalState(item.id, updatedData);
          } else {
            console.error('Item ID or User ID is undefined or invalid');
          }
        }
      );
    };

    onMounted(async () => {
      loading.value = true;
      rawItems.value = await getPrecurations();
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
      deleteItem,
      isCuratorOrAdmin,
      openConfirmModal,
      onConfirm,
      onCancel,
      confirmModalVisible,
      confirmModalTitle,
      confirmModalMessage,
      approveItem,
      updateLocalState
    };
  },
};
</script>

<style scoped>
/* Add your CSS styling here */
</style>
