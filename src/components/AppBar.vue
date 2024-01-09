<!-- components/AppBar.vue -->
<template>
  <v-app-bar app color="primary" dark>
    <!-- Logo Image -->
    <v-img
      src="logo.png"
      class="mr-3 app-logo"
      contain
      max-height="48"
      max-width="48"
      @click="$router.push('/')"
    ></v-img>

    <!-- Toolbar Title -->
    <v-toolbar-title class="clickable" @click="$router.push('/')">
      Gene Curator
    </v-toolbar-title>

    <!-- Navigation Link to Genes View -->
    <v-btn text to="/">Genes</v-btn>

    <!-- Navigation Link to Upload View -->
    <v-btn text to="/upload">Gene Admin</v-btn>

    <!-- Theme Toggle Button -->
    <v-btn icon @click="toggleTheme">
      <v-icon>
        {{ darkTheme ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
      </v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useTheme } from 'vuetify';

export default {
  name: 'AppBar',

  /**
   * Component setup function.
   * @returns {Object} The reactive properties and methods for the component.
   */
  setup() {
    const theme = useTheme();
    const darkTheme = ref(theme.global.current.value.dark); // Reactive property for dark theme state

    /**
     * Toggles the application theme between light and dark.
     */
    const toggleTheme = () => {
      const isDark = !theme.global.current.value.dark;
      theme.global.name.value = isDark ? 'dark' : 'light';
      localStorage.setItem('darkTheme', isDark.toString());
      darkTheme.value = isDark; // Update the darkTheme state
    };

    /**
     * Lifecycle hook that runs when component is mounted.
     * Retrieves and applies the saved theme preference from localStorage.
     */
    onMounted(() => {
      const savedTheme = localStorage.getItem('darkTheme');
      if (savedTheme !== null) {
        const isDark = savedTheme === 'true';
        theme.global.name.value = isDark ? 'dark' : 'light'; // Corrected to set the theme according to saved value
        darkTheme.value = isDark; // Update the darkTheme state
      }
    });

    return {
      toggleTheme,
      darkTheme, // Return darkTheme to make it available in the template
    };
  },
};
</script>

<style scoped>
/**
 * Keyframes for fadeIn animation.
 * Gradually increases the opacity of an element from 0 to 1.
 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/**
 * Keyframes for pulse animation.
 * Creates a pulsating effect by scaling the element from its original size to 10% larger.
 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/**
 * Styles for the application logo.
 * Sets a maximum width, adds right margin, and applies the fadeIn animation.
 */
.app-logo {
  max-width: 92px; /* Fixed maximum width for consistency */
  margin-right: 10px; /* Spacing between logo and title */
  animation: fadeIn 2s ease-out forwards; /* Applies the fadeIn animation */
}

/**
 * Hover effect for the application logo.
 * Adds a pulse animation and changes the cursor to pointer on hover.
 */
.app-logo:hover {
  animation: pulse 2s infinite; /* Continuous pulse animation on hover */
  cursor: pointer; /* Indicates the logo is clickable */
}

/**
 * Hover effect for clickable elements in the toolbar.
 * Reduces opacity and adds a smooth transition effect on hover.
 */
.clickable:hover {
  opacity: 0.8; /* Slightly reduces opacity to indicate interactivity */
  transition: opacity 0.3s ease; /* Smooth transition for the opacity change */
  cursor: pointer; /* Indicates the element is clickable */
}
</style>
