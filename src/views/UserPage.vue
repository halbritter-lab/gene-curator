<template>
  <v-container>
    <v-card>
      <v-card-title>User Information</v-card-title>
      <v-card-text>
        <p><strong>Name:</strong> {{ user.displayName }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <!-- Add more user info as needed -->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';

export default {
  name: 'UserPage',
  setup() {
    const auth = getAuth();
    const user = ref(auth.currentUser);

    onMounted(() => {
      // If needed, refresh or fetch user data
    });

    return {
      user
    };
  }
};
</script>
