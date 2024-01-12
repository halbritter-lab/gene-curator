<!-- views/USerPage.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title>User Information</v-card-title>
      <v-card-text>
        <p><strong>Name:</strong> {{ userData.displayName || userData.email }}</p>
        <p><strong>Email:</strong> {{ userData.email }}</p>
        <p><strong>Role:</strong> {{ userData.role }}</p>
        <div v-if="userData.permissions">
          <p><strong>Permissions:</strong></p>
          <ul>
            <li v-for="(value, key) in userData.permissions" :key="key">
              {{ key }}: {{ value ? 'Yes' : 'No' }}
            </li>
          </ul>
        </div>
        <!-- Add more user info as needed -->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getUserByEmail } from '@/stores/usersStore'; // Import the getUserByEmail function

export default {
  name: 'UserPage',
  setup() {
    const auth = getAuth();
    const userData = ref({});

    onMounted(async () => {
      if (auth.currentUser) {
        try {
          const userFromDb = await getUserByEmail(auth.currentUser.email);
          userData.value = { ...userFromDb, displayName: auth.currentUser.displayName };
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });

    return {
      userData
    };
  }
};
</script>
