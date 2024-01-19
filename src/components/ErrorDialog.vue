<template>
  <v-dialog width="470">
    <v-card style="padding: 10px 0">
      <v-card-title
        style="font-family: google-sans, sans-serif; font-size: 24px"
      >
        {{ error.title }}
      </v-card-title>
      <v-card-text>
        {{ error.message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" elevation="0" @click="$emit('value', false)"
          >Ok</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ErrorDialog",

  props: {
    error: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
