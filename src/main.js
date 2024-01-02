// main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // Import the router

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
  .use(vuetify)
  .use(router) // Use the router
  .mount('#app')