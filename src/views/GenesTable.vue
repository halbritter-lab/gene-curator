<!-- /views/GenesTable.vue -->
<template>
  <v-container>
    <h1>Data Table View</h1>
    <DataDisplayTable />
  </v-container>
</template>

<script>
import DataDisplayTable from '@/components/DataDisplayTable.vue'; // Adjust the path as necessary

export default {
  name: 'GenesTable',
  components: {
    DataDisplayTable,
  },
};
</script>
