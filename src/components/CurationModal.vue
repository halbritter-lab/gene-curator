<!-- components/CurationModal.vue -->
<template>
  <v-dialog v-model="isOpen" persistent max-width="1200px">
    <v-card>
      <v-card-title>
        Gene Curation - {{ editedItem.approved_symbol }} - HGNC:{{ editedItem.hgnc_id }}
      </v-card-title>
      <v-card-text>
        <!-- Gene Detail Card Component -->
        <GeneDetailCard :id="editedItem.hgnc_id" visibilityScope="curationView" :showTitle="false" />

        <!-- Precuration Form Component -->
        <PrecurationForm
          :approvedSymbol="editedItem.approved_symbol"
          :hgncId="editedItem.hgnc_id"
          @precuration-accepted="handlePrecurationAccepted"
        />
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
import GeneDetailCard from './GeneDetailCard.vue';
import PrecurationForm from './PrecurationForm.vue';

export default {
  components: {
    GeneDetailCard,
    PrecurationForm
  },
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
    const isOpen = ref(props.open);
    const editedItem = ref({ ...props.item });

    watchEffect(() => {
      isOpen.value = props.open;
      editedItem.value = { ...props.item };
    });

    // Mock method to handle the precuration accepted event
    // TODO: Implement your own logic here
    const handlePrecurationAccepted = (precurationData) => {
      // You would implement your logic here to handle the precuration data
      // For example, you might want to save this data to your database
      console.log('Precuration accepted:', precurationData);
      // Emit an event or call an API endpoint
    };

    const close = () => emit('close');
    const save = () => emit('save', editedItem.value);

    // Return the method so it can be used in the template
    return {
      isOpen,
      editedItem,
      close,
      save,
      handlePrecurationAccepted, // Make sure to return this method
    };
  },
};
</script>


<style scoped>
/* Add styles if needed */
</style>
