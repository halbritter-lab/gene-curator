<!-- components/HelpDialog.vue -->
<template>
  <v-dialog
    width="auto"
    v-model="dialog"
  >
    <v-card :style="cardStyle">
      <v-card-title :style="titleStyle">
        {{ title }}
      </v-card-title>
      <!-- Use a div instead of v-card-text to avoid the warning and still render HTML -->
      <div v-html="content" class="v-card-text" :style="contentStyle">
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" elevation="0" @click="dialog = false">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "HelpDialog",

  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      dialog: false,
    }
  },
  computed: {
    cardStyle() {
      return this.config.cardStyle || { padding: '10px 0' };
    },
    titleStyle() {
      return this.config.titleStyle || { fontFamily: 'google-sans, sans-serif', fontSize: '24px' };
    },
    contentStyle() {
      // You can define default styles or pull them from config
      return this.config.contentStyle || {};
    },
  },
  methods: {
  },
};
</script>
