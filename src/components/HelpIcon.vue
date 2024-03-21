<!-- components/HelpIcon.vue -->
<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ attrs }">
      <v-icon v-bind="attrs" @click="dialog = true">
        mdi-help-circle-outline
      </v-icon>
    </template>
    <span>Click for help</span>
  </v-tooltip>
  <!-- Listen for the update:modelValue event to sync the dialog state -->
  <HelpDialog
    :modelValue="dialog"
    @update:modelValue="value => dialog = value"
    :helpContent="helpContent"
  />
</template>

<script>
import HelpDialog from './HelpDialog.vue';

export default {
  components: {
    HelpDialog,
  },
  props: {
    helpContent: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    openHelpDialog() {
      console.log(this.helpContent);
      this.dialog = true;
    },
  },
};
</script>
