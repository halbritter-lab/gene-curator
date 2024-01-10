<!-- components/CurationModal.vue -->
<template>
  <v-dialog v-model="isOpen" persistent max-width="1200px">
    <v-card>
      <v-card-title>
        Gene Curation - {{ editedItem.approved_symbol }} - HGNC:{{ editedItem.hgnc_id }}
      </v-card-title>
      <v-card-text>
        <GeneDetailCard :id="editedItem.hgnc_id" visibilityScope="curationView" :showTitle="false" />
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
import GeneDetailCard from './GeneDetailCard.vue'; // Adjust the path to where your GeneDetailCard component is located

export default {
  components: {
    GeneDetailCard
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

    const close = () => emit('close');
    const save = () => emit('save', editedItem.value);

    return {
      isOpen,
      editedItem,
      close,
      save,
    };
  },
};
</script>

<style scoped>
/* Add styles if needed */
</style>
