<!-- views/LoginUser.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title>Login</v-card-title>
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

          <v-btn @click="loginWithEmail">Login</v-btn>
          <!-- New Registration Link -->
          <v-btn text @click="navigateToRegister">
            Don't have an account? Register
          </v-btn>
          
          <!-- Visual Divider -->
          <div class="login-divider">
            OR
          </div>

          <v-btn @click="signInWithGoogle" color="primary">Login with Google</v-btn>

        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script>
import AuthService from '@/stores/AuthService';
import { useRouter } from 'vue-router'; // Import useRouter

export default {
  name: 'LoginUser',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  setup() {
    const router = useRouter(); // Use the useRouter hook

    return { router }; // Return router to use it inside methods
  },
  methods: {
    async loginWithEmail() {
      try {
        const user = await AuthService.loginWithEmail(this.email, this.password);
        // Handle successful login
        this.saveUserToLocalStorage(user);
        this.router.push('/'); // Redirect to home page after successful login
      } catch (error) {
        // Handle login error
        console.error(error);
      }
    },
    async signInWithGoogle() {
      try {
        const user = await AuthService.signInWithGoogle();
        // Handle successful login
        this.saveUserToLocalStorage(user);
        this.router.push('/'); // Redirect to home page after successful login
      } catch (error) {
        // Handle login error
        console.error(error);
      }
    },
    navigateToRegister() {
      this.router.push('/register'); // Add method to navigate to the registration view
    },
    saveUserToLocalStorage(user) {
      if (user) {
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          displayName: user.displayName || user.email
        }));
        localStorage.setItem('isLoggedIn', 'true');
      }
    }
  }
};
</script>


<style>
  /* Updated style for the visual divider */
  .login-divider {
    text-align: center;
    margin: 20px 0;
    color: #757575;
    display: flex;
    align-items: center; /* Vertically align text and Google button */
  }
</style>

