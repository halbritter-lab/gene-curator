<!--components/CurationTable.vue-->
<template>
  <v-container>
    <h1>Curation Table</h1>

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
      <template v-slot:action-slot="{ item }">
        <v-btn color="primary" @click="openModal(item)">Edit</v-btn>
        <v-btn color="error" @click="deleteItem(item)">Delete</v-btn>
      </template>

      <template v-slot:modal>
        <!-- Your modal component here -->
      </template>
    </DataDisplayTable>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import DataDisplayTable from '@/components/DataDisplayTable.vue';
import { getCurations, deleteCuration } from '@/stores/curationsStore';

export default {
  name: 'CurationTable',
  components: {
    DataDisplayTable
  },
  setup() {
    const rawItems = ref({});
    const loading = ref(false);
    const page = ref(1);
    const itemsPerPage = ref(10);

    const totalItems = computed(() => Object.keys(rawItems.value).length);
    const paginatedItems = computed(() => {
      const start = (page.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return Object.values(rawItems.value).slice(start, end);
    });

    const headers = [
      { title: 'Approved Symbol', value: 'approved_symbol' },
      { title: 'Verdict', value: 'verdict' },
      { title: 'Created', value: 'createdAt' },
    ];

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
      ]
    };

    const updatePage = (newPage) => {
      page.value = newPage;
    };

    const updateItemsPerPage = (newItemsPerPage) => {
      itemsPerPage.value = newItemsPerPage;
    };

    const handleAction = (action, item) => {
      console.log(`Action: ${action} for item:`, item);
      // Implement action handling logic here
    };

    const deleteItem = async (item) => {
      // Implement deletion logic here
      await deleteCuration(item.id);
      // Refresh the list or handle UI update
    };

    onMounted(async () => {
      loading.value = true;
      rawItems.value = await getCurations();
      console.log('Curations:', rawItems.value);
      loading.value = false;
    });

    return {
      headers,
      paginatedItems,
      tableConfig,
      totalItems,
      loading,
      updatePage,
      updateItemsPerPage,
      handleAction,
      deleteItem
    };
  },
};
</script>

<style scoped>
/* Add your CSS styling here */
</style>
