<template>
  <v-dialog
    width="200"
    :value="value"
    @input="$emit('value', false)"
    persistent
  >
    <v-card
      style="
        padding: 20px;
        text-align: left;
        display: flex;
        flex-direction: row;
        align-items: center;
      "
    >
      <v-progress-circular indeterminate color="primary" />
      <p style="margin-left: 20px; margin-bottom: 0">{{ message }}</p>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "LoadingDialog",

  model: {
    prop: "value",
    event: "value",
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    message: {
      type: String,
      default: "",
    },
  },
};
</script>
