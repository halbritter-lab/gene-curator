<!-- components/CurationModal.vue -->
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
import { ref, watchEffect } from 'vue';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const editedItem = ref({});

    // Watch for changes in the "item" prop and update the local state
    watchEffect(() => {
      editedItem.value = { ...props.item };
    });

    const isOpen = ref(props.open);

    // When trying to close the dialog, emit an event instead of mutating the prop
    const close = () => {
      emit('close');
    };

    // Emit the save event with the edited item
    const save = () => {
      emit('save', editedItem.value);
    };

    return {
      isOpen,
      editedItem,
      close,
      save,
    };
  },
};
</script>
