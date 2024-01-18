<!-- views/RegisterUser.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title>Register</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field 
            label="Email" 
            v-model="email" 
            type="email" 
            required
          ></v-text-field>
          <v-text-field 
            label="Password" 
            v-model="password" 
            type="password" 
            required
          ></v-text-field>
          <v-btn @click="register">Register</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>

  <!-- Snackbar for registration feedback -->
  <v-snackbar
    v-model="snackbarVisible"
    :color="snackbarColor"
    :timeout="6000"
  >
    {{ snackbarMessage }}
  </v-snackbar>

</template>

<script>
import AuthService from '@/stores/AuthService';

export default {
  name: 'RegisterUser',
  data() {
    return {
      email: '',
      password: '',
      // Snackbar data
      snackbarVisible: false,
      snackbarMessage: '',
      snackbarColor: 'info'
    };
  },
  methods: {
    displaySnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbarVisible = true;
    },

    async register() {
      try {
        const user = await AuthService.registerWithEmail(this.email, this.password);
        console.log(user);
        // Handle successful registration
        this.displaySnackbar('Registration successful! Redirecting...', 'success');

        // Redirect after 3 seconds
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);

      } catch (error) {
        // Handle registration error
        this.displaySnackbar(error.message, 'error');
      }
    }
  }
};
</script>
