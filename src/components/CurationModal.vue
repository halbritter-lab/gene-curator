<!-- components/CurationModal.vue -->
<template>
  <v-dialog v-model="isOpen" persistent max-width="1200px">
    <v-card>
      <v-card-title>
        Gene Curation - {{ editedItem.approved_symbol }} - HGNC:{{ editedItem.hgnc_id }}
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tab" grow>
          <v-tab>Pre-Curation</v-tab>
          <v-tab v-if="showCurationTab">Curation</v-tab>
        </v-tabs>

         <v-window v-model="tab" style="min-height: 500px;">
          <v-window-item>
            <!-- Gene Detail Card Component -->
            <GeneDetailCard :id="editedItem.hgnc_id" visibilityScope="curationView" :showTitle="false" />

            <!-- Precuration Form Component -->
            <PrecurationForm
              :approvedSymbol="editedItem.approved_symbol"
              :hgncId="editedItem.hgnc_id"
              @precuration-accepted="handlePrecurationAccepted"
            />
          </v-window-item>

          <v-window-item v-if="showCurationTab">
            <!-- CurationForm Component -->
            <CurationForm
              :approvedSymbol="editedItem.approved_symbol"
              :hgncId="editedItem.hgnc_id"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

<v-snackbar
  v-model="snackbarVisible"
  :color="snackbarColor"
  :timeout="6000"
>
  {{ snackbarMessage }}
</v-snackbar>

</template>


<script>
import { ref, watchEffect, watch } from 'vue';
import GeneDetailCard from './GeneDetailCard.vue';
import PrecurationForm from './PrecurationForm.vue';
import CurationForm from './CurationForm.vue'; // Import the CurationForm component
import { getPrecurationByHGNCIdOrSymbol } from '@/stores/precurationsStore';

export default {
  components: {
    GeneDetailCard,
    PrecurationForm,
    CurationForm
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
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const isOpen = ref(props.open);
    const editedItem = ref({ ...props.item });
    const showCurationTab = ref(false); // Controls the visibility of the curation tab
    const tab = ref(0); // Controls the active tab

    const snackbarVisible = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('success'); // Default color

    const showSnackbar = (message, color = 'success') => {
      snackbarMessage.value = message;
      snackbarColor.value = color;
      snackbarVisible.value = true;
    };

    watchEffect(() => {
      isOpen.value = props.open;
      editedItem.value = { ...props.item };
    });

    const handlePrecurationAccepted = () => {
      showCurationTab.value = true; // Show the curation tab
      tab.value = 1; // Switch to the curation tab
    };

    const close = () => emit('close');
    const save = () => emit('save', editedItem.value);

    const checkExistingCuration = async () => {
      try {
        const existingCuration = await getPrecurationByHGNCIdOrSymbol(editedItem.value.hgnc_id || editedItem.value.approved_symbol);
        if (existingCuration) {
          showCurationTab.value = true;
          tab.value = 1; // Open Curation tab if curation exists
        } else {
          showCurationTab.value = false;
          tab.value = 0; // Open Precuration tab if curation does not exist
        }
      } catch (error) {
        showSnackbar("Error checking existing curation: " + error.message, 'error');
      }
    };

    // Watch for changes to the 'open' prop
    watch(() => props.open, async (newVal) => {
      if (newVal) { // If the modal is being opened
        await checkExistingCuration();
      }
    });

    return {
      isOpen,
      editedItem,
      close,
      save,
      handlePrecurationAccepted,
      showCurationTab,
      tab,
      snackbarVisible,
      snackbarMessage,
      snackbarColor,
      showSnackbar,
    };
  },
};
</script>


<style scoped>
/* Add styles if needed */
</style>
