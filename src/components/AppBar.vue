<!-- components/AppBar.vue -->
<template>
  <v-app-bar app color="primary" dark>
    <v-img
      src="logo.png"
      class="mr-3 app-logo"
      contain
      max-height="48"
      max-width="48"
    ></v-img>

    <v-toolbar-title>Gene Curator</v-toolbar-title>
    <!-- Add more toolbar items here as needed -->
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
};
</script>

<style scoped>
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
