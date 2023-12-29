<template>
  <v-app>
    <AppBar/>
    <v-main>
      <DataDisplayTable />
    </v-main>
  </v-app>
</template>

<script>
import DataDisplayTable from './components/DataDisplayTable.vue';
import AppBar from './components/AppBar.vue';

export default {
  name: 'App',
  components: {
    DataDisplayTable,
    AppBar,
  },
};
</script>
