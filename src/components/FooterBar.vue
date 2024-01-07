<!-- components/FooterBar.vue -->
<template>
  <v-footer app padless class="elevation-3"> <!-- Add elevation class here -->
    <v-row justify="center" no-gutters>
      <v-col cols="auto">
        <v-btn icon :href="codeLink" target="_blank" text class="mx-2"> <!-- Add horizontal padding here -->
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn icon :href="docsLink" target="_blank" text class="mx-2"> <!-- Add horizontal padding here -->
          <v-icon>mdi-file-document-outline</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="auto"> <!-- License link column -->
        <v-btn icon :href="licenseLink" target="_blank" text class="mx-2">
          <v-icon>mdi-certificate</v-icon> <!-- You can choose an appropriate icon -->
        </v-btn>
      </v-col>

      <!-- Add more icons and links as needed -->
    </v-row>
  </v-footer>
</template>

<script>

export default {
  name: 'FooterBar',
  data: () => ({
    codeLink: 'https://github.com/halbritter-lab/gene-curator', // Replace with your code repository link
    docsLink: 'https://your-documentation-link', // Replace with your documentation link
    licenseLink: 'https://github.com/halbritter-lab/gene-curator/blob/master/LICENSE', // Replace with your license link
  }),
};
</script>

<style scoped>

</style>
