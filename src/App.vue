<!-- / App.vue -->
<template>
  <!-- The root Vue application -->
  <v-app>
    <!-- Include the AppBar component -->
    <AppBar/>

    <!-- Router View -->
    <v-main>
      <router-view/>
    </v-main>

    <!-- Include the FooterBar component -->
    <FooterBar/>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar.vue';
import FooterBar from './components/FooterBar.vue';

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
   * @property {object} AppBar - The AppBar component.
   */
  components: {
    AppBar,
    FooterBar,
  },
};
</script>
