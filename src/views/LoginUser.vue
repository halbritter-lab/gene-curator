<!-- views/LoginUser.vue -->
<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5" style="width: 600px">
      <v-card-title class="text-center text-h5 mb-4">Login</v-card-title>
      <v-card-text>
        <v-form ref="loginForm" @submit.prevent="loginWithEmail">
          <v-text-field
            color="primary"
            label="Email"
            v-model="email"
            type="email"
            :rules="[
              (v) => !!v || 'Email is required',
              (v) => /.+@.+/.test(v) || 'Email must be valid',
            ]"
            variant="outlined"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            color="primary"
            label="Password"
            v-model="password"
            type="password"
            :rules="[
              (v) => !!v && v.length >= 6 || 'Password must be at least 6 characters',
            ]"
            variant="outlined"
          ></v-text-field>


          <div class="d-flex justify-space-between align-center mt-2">
            <v-btn type="submit" color="primary">Login</v-btn>

            <v-btn
              @click="navigateToRegister"
              variant="text"
              class="text-decoration-underlined"
            >
              Don't have an account? Register
            </v-btn>
          </div>

          <div class="login-divider">OR</div>

          <v-btn @click="signInWithGoogle" color="primary">
            Login with Google</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>

    <error-dialog
      v-model="error"
      :error="errorVal"
      @value="error = $event"
    ></error-dialog>
    <loading-dialog v-model="loading" message="Please wait..." />
  </v-container>
</template>

<script>
import AuthService from "@/stores/AuthService";
import { useRouter } from "vue-router"; // Import useRouter
import ErrorDialog from "@/components/ErrorDialog";
import LoadingDialog from "@/components/LoadingDialog";

export default {
  name: "LoginUser",
  components: {
    ErrorDialog,
    LoadingDialog,
  },
  data() {
    return {
      error: false,
      errorVal: {},
      loading: false,

      email: "",
      password: "",
    };
  },
  setup() {
    const router = useRouter(); // Use the useRouter hook

    return { router }; // Return router to use it inside methods
  },
  methods: {
    async loginWithEmail() {
      const { valid } = await this.$refs.loginForm.validate();
      if (!valid) return;

      try {
        this.loading = true;
        const user = await AuthService.loginWithEmail(
          this.email,
          this.password
        );
        // Handle successful login
        this.saveUserToLocalStorage(user);
        this.router.push("/"); // Redirect to home page after successful login
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error(error);

        this.error = true;
        this.errorVal = {
          title: "Login Error",
          message: "There was an error logging you in. Please try again.",
        };
      }
    },
    async signInWithGoogle() {
      try {
        const user = await AuthService.signInWithGoogle();
        // Handle successful login
        this.saveUserToLocalStorage(user);
        this.router.push("/"); // Redirect to home page after successful login
      } catch (error) {
        console.error(error);

        this.error = true;
        this.errorVal = {
          title: "Login Error",
          message:
            "There was an error logging you in with Google. Please try again.",
        };
      }
    },
    navigateToRegister() {
      this.router.push("/register");
    },
    saveUserToLocalStorage(user) {
      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            displayName: user.displayName || user.email,
          })
        );
        localStorage.setItem("isLoggedIn", "true");
      }
    },
  },
};
</script>

<style>
.login-divider {
  text-align: center;
  margin: 20px 0;
  color: #757575;
  display: flex;
  align-items: center;
}
</style>
