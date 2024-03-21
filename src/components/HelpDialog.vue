<!-- components/HelpDialog.vue -->
<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>{{ helpContent.HelpDialog.title }}</v-card-title>
      <v-container>
        <v-row>
          <v-col v-for="section in helpContent.sections" :key="section.header" cols="12">
            <v-card outlined>
              <v-card-title>{{ section.header }}</v-card-title>
              <v-card-text v-html="section.content"></v-card-text>
              <v-card-actions v-if="section.links">
                <v-btn v-for="link in section.links" :key="link.title" :href="link.url" text>
                  {{ link.title }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'HelpDialog',
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
  emits: ['update:modelValue'],
  methods: {
    close() {
      this.$emit('update:modelValue', false);
    },
  },
};
</script>
