<!-- views/RegisterUser.vue -->
<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5" style="width: 600px">
      <v-card-title class="text-center text-h5 mb-4">Register</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register" ref="registerForm">
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
              (v) => !!v || 'Password is required',
              (v) => (v) =>
                (v && v.length >= 6) ||
                'Password must be at least 6 characters',
            ]"
            variant="outlined"
          ></v-text-field>

          <v-btn type="submit" color="primary" class="mt-4">Register</v-btn>
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
import AuthService from "@/stores/AuthService";
import ErrorDialog from "@/components/ErrorDialog";
import LoadingDialog from "@/components/LoadingDialog";

export default {
  name: "RegisterUser",
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
  methods: {
    displaySnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbarVisible = true;
    },

    async register() {
      // Validate form
      const { valid } = await this.$refs.registerForm.validate();
      if (!valid) return;

      try {
        // Register user
        this.loading = true;
        const user = await AuthService.registerWithEmail(
          this.email,
          this.password
        );
        console.log(user);
        this.loading = false;
        this.$router.push("/login");
        // Handle successful registration
        this.displaySnackbar('Registration successful! Redirecting...', 'success');

        // Redirect after 3 seconds
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);

      } catch (error) {
       this.error = true;
        this.errorVal = {
          title: "Error",
          description: "There was an error registering your account",
        };
      }
    },
  },
};
</script>
