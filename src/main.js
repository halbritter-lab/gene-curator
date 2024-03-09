// main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // Import the router
import MessageSnackbar from './components/MessageSnackbar.vue'; // Import the MessageSnackbar component

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Material Design Icons
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark'
  }
})

createApp(App)
  .use(vuetify)
  .use(router) // Use the router
  .component('MessageSnackbar', MessageSnackbar) // Register MessageSnackbar globally
  .mount('#app');
