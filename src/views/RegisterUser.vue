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
</template>

<script>
import AuthService from '@/stores/AuthService';

export default {
  name: 'RegisterUser',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        const user = await AuthService.registerWithEmail(this.email, this.password);
        console.log(user);
        // Handle successful registration
      } catch (error) {
        // Handle registration error
      }
    }
  }
};
</script>
