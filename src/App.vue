<template>
  <v-app>
    <!-- App bar -->
    <v-app-bar app color="primary" dark>
      <!-- Logo Image -->
      <v-img
        src="logo.png"
        class="mr-3"
        contain
        max-height="48"
        max-width="48"
      ></v-img>

      <!-- App Title -->
      <v-toolbar-title>Gene Curator</v-toolbar-title>
      <!-- Add more toolbar items here as needed -->
    </v-app-bar>

    <!-- Main content -->
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
/* Add any additional styles here */
</style>
