<template>
  <v-footer app padless class="elevation-3">
    <v-row justify="center" no-gutters>
      <v-col cols="auto" v-for="link in footerLinks" :key="link.text">
        <v-btn icon :href="link.href" target="_blank" text>
          <v-icon>{{ link.icon }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import { ref, onMounted } from 'vue';
import footerConfig from '../config/footerConfig.json'; // Adjust the path to your config file

export default {
  name: 'FooterBar',
  setup() {
    const footerLinks = ref(footerConfig.links);

    onMounted(() => {
      // Perform any additional setup after component has mounted
      // For example, you could fetch the footer configuration from an API if needed
    });

    return {
      footerLinks
    };
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
