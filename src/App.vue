<!-- / App.vue -->
<template>
  <!-- The root Vue application -->
  <v-app>
    <!-- Include the AppBar component -->
    <AppBar/>
    
    <!-- Main content area containing the DataDisplayTable component -->
    <v-main>
      <DataDisplayTable />
    </v-main>
  </v-app>
</template>

<script>
import DataDisplayTable from './components/DataDisplayTable.vue';
import AppBar from './components/AppBar.vue';

/**
 * The main App component.
 *
 * @name App
 * @component
 */
export default {
  /**
   * The name of the component.
   *
   * @type {string}
   */
  name: 'App',

  /**
   * Components used by the App component.
   *
   * @type {Object}
   * @property {object} DataDisplayTable - The DataDisplayTable component.
   * @property {object} AppBar - The AppBar component.
   */
  components: {
    DataDisplayTable,
    AppBar,
  },
};
</script>
