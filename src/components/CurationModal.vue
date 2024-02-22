<!-- components/CurationModal.vue -->
<template>
  <v-dialog v-model="isOpen" persistent max-width="1200px">
    <v-card>
      <v-card-title>
        {{ title }} - {{ editedItem.approved_symbol }} - HGNC:{{ editedItem.hgnc_id }}
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tab" grow>
          <v-tab v-if="showPreCurationTab">Pre-Curation</v-tab>
          <v-tab v-if="showCurationTab">Curation</v-tab>
        </v-tabs>

         <v-window v-model="tab" style="min-height: 300px;">
          <v-window-item>
            <!-- Gene Detail Card Component -->
            <GeneDetailCard
               v-if="showGeneDetailCard"
              :id="editedItem.hgnc_id"
              visibilityScope="curationView"
              :showTitle="false"
            />

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
import { ref, watchEffect, watch, computed } from 'vue';
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
    context: {
      type: String,
      default: 'gene' // Default context
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const isOpen = ref(props.open);
    const editedItem = ref({ ...props.item });
    const showGeneDetailCard = ref(true); // Controls the visibility of the gene detail card
    const showPreCurationTab = ref(true); // Controls the visibility of the precuration tab
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

    // Computed property to determine the title of the modal
    const title = computed(() => {
      return props.context === 'curation' ? 'Curation' 
        : props.context === 'precuration' ? 'Precuration' 
        : 'Gene Curation';
    });

    // Watch for changes to the 'open' prop
    watch(() => props.open, async (newVal) => {
      if (newVal) { // If the modal is being opened
        await initializeModal();
      }
    });

    // Adjust the initial tab and content based on the context and existing curation
    const initializeModal = async () => {
      if (props.context === 'precuration') {
        showGeneDetailCard.value = false;
        showPreCurationTab.value = true;
        showCurationTab.value = false;
        tab.value = 0;
      } else if (props.context === 'curation') {
        showGeneDetailCard.value = false;
        showPreCurationTab.value = false;
        await checkExistingCuration(); // Check if there's an existing curation
        // Set tab based on the existence of curation
        tab.value = showCurationTab.value ? 1 : 0;
      } else {
        // For 'gene' context or other cases
        await checkExistingCuration();
      }
    };

    // Call initializeModal when the modal is opened
    watch(() => props.open, (newVal) => {
      if (newVal) {
        initializeModal();
      }
    });

    return {
      initializeModal,
      isOpen,
      editedItem,
      close,
      save,
      handlePrecurationAccepted,
      showGeneDetailCard,
      showPreCurationTab,
      showCurationTab,
      tab,
      snackbarVisible,
      snackbarMessage,
      snackbarColor,
      showSnackbar,
      title
    };
  },
};
</script>


<style scoped>
/* Add styles if needed */
</style>
