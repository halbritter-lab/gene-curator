<!-- PageNotFound.vue -->
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h5">
            404: Page Not Found
          </v-card-title>
          <v-card-text>
            <p>The page you are looking for does not exist or has been moved.</p>
            <v-btn color="primary" @click="goHome">Go Home</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PageNotFound',
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* Your styles here */
</style>
