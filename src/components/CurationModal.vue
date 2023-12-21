<!-- CurationModal.vue -->
<template>
  <v-dialog v-model="isOpen" persistent max-width="600px">
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
            <!-- Add more fields as needed -->
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
    },
    open: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editedItem: {}, // Initialize editedItem to an empty object
    };
  },
  computed: {
    // Use a computed property to interpret the prop for internal use
    isOpen: {
      get() {
        return this.open;
      },
      set(value) {
        // When trying to close the dialog, emit an event instead of mutating the prop
        if (!value) {
          this.close();
        }
      }
    }
  },
  watch: {
    item: {
      handler(newVal) {
        this.editedItem = { ...newVal };
      },
      immediate: true, // Trigger the watcher immediately with the current value of `item`
      deep: true
    }
  },
  methods: {
    save() {
      this.$emit('save', this.editedItem); // Emit the save event with the edited item
    },
    close() {
      this.$emit('close'); // Emit the close event to notify the parent to update its state
    }
  }
};
</script>
