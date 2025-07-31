<template>
  <v-snackbar 
    v-model="visible"
    :color="color"
    :timeout="timeout"
    vertical>
    <strong>{{ title }}</strong> - {{ message }}
    <!-- Copy to Clipboard Icon -->
    <v-icon right v-if="copyIconVisible" @click="copyMessage">mdi-content-copy</v-icon>
  </v-snackbar>
</template>

<script>
export default {
  name: "MessageSnackbar",
  props: {
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "info",
    },
    timeout: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      visible: false,
      copyIconVisible: true, // Control visibility of the copy icon
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    copyMessage() {
      navigator.clipboard.writeText(this.message)
        .then(() => {
          // Show a confirmation message or change icon state as needed
          console.log("Message copied to clipboard");
        })
        .catch(err => {
          console.error("Could not copy message: ", err);
        });
    },
  },
};
</script>

<style scoped>
/* Style for the copy icon */
.v-snackbar .mdi-content-copy {
  margin-left: auto; /* Aligns the icon to the right side of the snackbar */
  cursor: pointer; /* Changes cursor to pointer on hover over the icon */
}
</style>
