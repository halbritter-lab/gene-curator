<template>
  <v-dialog v-model="modalOpen" persistent max-width="600px">
    <v-card>
      <v-card-title>
        Edit Data
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="editedItem.approved_symbol" label="Approved Symbol"></v-text-field>
            </v-col>
            <!-- Repeat for other fields -->
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modalOpen: false,
      editedItem: {}
    };
  },
  watch: {
    item: {
      handler(newVal) {
        this.editedItem = { ...newVal };
        this.modalOpen = true;
      },
      deep: true
    }
  },
  methods: {
    save() {
      this.$emit('save', this.editedItem);
      this.close();
    },
    close() {
      this.modalOpen = false;
      this.$emit('close');
    }
  }
};
</script>
