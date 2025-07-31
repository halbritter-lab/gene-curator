<!-- components/ConfirmationModal.vue -->
<template>
  <v-dialog v-model="internalVisible" max-width="400px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green" @click="confirmAction">Yes</v-btn>
        <v-btn color="red" @click="cancelAction">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: String,
    message: String
  },
  emits: ['confirm', 'cancel', 'update:visible'],
  computed: {
    internalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      }
    }
  },
  methods: {
    confirmAction() {
      this.$emit('confirm');
      this.$emit('update:visible', false);
    },
    cancelAction() {
      this.$emit('cancel');
      this.$emit('update:visible', false);
    }
  }
};
</script>
