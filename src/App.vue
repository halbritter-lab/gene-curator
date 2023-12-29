<template>
  <v-app>
    <!-- App bar -->
    <v-app-bar app color="primary" dark>
      <!-- Logo Image -->
      <v-img
        src="logo.png"
        class="mr-3 app-logo"
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

/* Styles for the application logo */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.app-logo {
  max-width: 92px; /* Fixed maximum width */
  margin-right: 20px; /* Spacing between logo and title */
  animation: fadeIn 2s ease-out forwards;
}

.app-logo:hover {
  animation: pulse 2s infinite;
}

</style>
