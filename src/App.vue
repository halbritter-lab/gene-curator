<template>
  <v-app>
    <v-main>
      <DataDisplayTable/>
    </v-main>
  </v-app>
</template>

<script>
import DataDisplayTable from './components/DataDisplayTable.vue';

export default {
  name: 'App',
  components: {
    DataDisplayTable
  }
};
</script>

<style>
</style>
