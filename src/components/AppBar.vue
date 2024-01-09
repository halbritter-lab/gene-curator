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

    <!-- Toolbar Title and Version Info -->
    <v-toolbar-title class="clickable" @click="$router.push('/')">
      Gene Curator
      <br> <!-- Line break for version info -->
      <span class="version-info">
        Version: {{ version }} - Commit: {{ lastCommitHash }}
      </span>
    </v-toolbar-title>

    <!-- Dynamic Menu Items -->
    <template v-for="item in menuItems" :key="item.text">
      <v-btn :to="item.to" text>
        <v-icon left v-if="item.icon">{{ item.icon }}</v-icon>
        {{ item.text }}
      </v-btn>
    </template>

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
import packageInfo from '../../package.json'; // Adjust the path to your package.json
import appConfig from '../config/appConfig.json'; // Adjust the path to your appConfig.json
import menuConfig from '../config/menuConfig.json'; // Adjust the path to your menuConfig.json

export default {
  name: 'AppBar',

  /**
   * Component setup function.
   * @returns {Object} The reactive properties and methods for the component.
   */
  setup() {
    // Reactive property for dark theme state
    const theme = useTheme();
    const darkTheme = ref(theme.global.current.value.dark); // Reactive property for dark theme state

    // Menu items for the toolbar
    const menuItems = ref(menuConfig.items); // Reactive property for menu items

    /**
     * Toggles the application theme between light and dark.
     */
    const toggleTheme = () => {
      const isDark = !theme.global.current.value.dark;
      theme.global.name.value = isDark ? 'dark' : 'light';
      localStorage.setItem('darkTheme', isDark.toString());
      darkTheme.value = isDark; // Update the darkTheme state
    };

    // Extract the version from the package.json
    const version = packageInfo.version;

    // Reference for the last commit hash
    const lastCommitHash = ref('loading...');

    // Reference for the last commit hash
    const fetchError = ref(false);

    // Function to fetch last commit hash
    const fetchLastCommit = async () => {
      try {
        const repoName = appConfig.repoName; // Fetching repo name from config file
        const response = await fetch(`https://api.github.com/repos/${repoName}/commits?per_page=1`);
        if (!response.ok) throw new Error('Network response was not ok.');

        const commits = await response.json();
        if (commits.length) {
          lastCommitHash.value = commits[0].sha.substring(0, 7);
        }
      } catch (error) {
        console.error('Error fetching last commit:', error);
        fetchError.value = true;
        lastCommitHash.value = 'offline';
      }
    };

    /**
     * Lifecycle hook that runs when component is mounted.
     * Retrieves and applies the saved theme preference from localStorage.
     */
    onMounted(async () => {
      await fetchLastCommit();

      const savedTheme = localStorage.getItem('darkTheme');
      if (savedTheme !== null) {
        const isDark = savedTheme === 'true';
        theme.global.name.value = isDark ? 'dark' : 'light'; // Corrected to set the theme according to saved value
        darkTheme.value = isDark; // Update the darkTheme state
      }
    });

    return {
      darkTheme,
      toggleTheme,
      menuItems,
      version,
      lastCommitHash,
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

/**
 * Styles for the version info.
 * Adds right padding and decreases the top margin to bring it closer to the app name.
 */
.version-info {
  display: block; /* Ensures the version info is on a new line */
  margin-left: auto;
  padding-right: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-top: -10px; /* Decrease the top margin to bring it closer to the app name */
}
</style>
