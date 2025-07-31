<!-- NotAuthorized.vue -->
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h5">
            Not Authorized
          </v-card-title>
          <v-card-text>
            <p>You do not have permission to view this page.</p>
            <v-btn color="primary" @click="goBack">Go Back</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotAuthorized',
  methods: {
    goBack() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
