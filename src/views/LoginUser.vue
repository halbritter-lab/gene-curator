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
          <v-btn @click="signInWithGoogle">Login with Google</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import AuthService from '@/stores/AuthService';

export default {
  name: 'LoginUser',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async loginWithEmail() {
      try {
        const user = await AuthService.loginWithEmail(this.email, this.password);
        // Handle successful login
        console.log(user);
        this.saveUserToLocalStorage(user);
      } catch (error) {
        // Handle login error
        console.error(error);
      }
    },
    async signInWithGoogle() {
      try {
        const user = await AuthService.signInWithGoogle();
        console.log(user);
        // Handle successful login
        this.saveUserToLocalStorage(user);
      } catch (error) {
        // Handle login error
        console.error(error);
      }
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