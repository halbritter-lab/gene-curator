// Vue.js type shims for TypeScript

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vuetify component types
declare module 'vuetify/components' {
  export * from 'vuetify/components'
}

declare module 'vuetify/directives' {
  export * from 'vuetify/directives'
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}