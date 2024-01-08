<!-- components/AppBar.vue -->
<template>
  <v-app-bar app color="primary" dark>
    <v-img
      src="logo.png"
      class="mr-3 app-logo"
      contain
      max-height="48"
      max-width="48"
      @click="$router.push('/')"
    ></v-img>

    <v-toolbar-title class="clickable" @click="$router.push('/')">
      Gene Curator
    </v-toolbar-title>

    <!-- Navigation Link to Genes View -->
    <v-btn text to="/">Genes</v-btn>

    <!-- Navigation Link to Upload View -->
    <v-btn text to="/upload">Gene Admin</v-btn>
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
  margin-right: 10px; /* Spacing between logo and title */
  animation: fadeIn 2s ease-out forwards;
}

.app-logo:hover {
  animation: pulse 2s infinite;
  cursor: pointer; /* Adds a pointer cursor on hover */
}

.clickable:hover {
  opacity: 0.8;
  transition: opacity 0.3s ease;
  cursor: pointer; /* Adds a pointer cursor on hover */
}
</style>
