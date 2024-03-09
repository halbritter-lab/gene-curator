<!-- components/CurationModal.vue -->
<template>
  <v-dialog v-model="isOpen" persistent max-width="1200px">
    <v-card>
      <div class="d-flex justify-space-between align-center">
        <v-card-title>
          {{ title }} - {{ editedItem.approved_symbol }} - HGNC:{{ editedItem.hgnc_id }}
          <GeneLinkChips
            :hgnc-id="editedItem.hgnc_id"
            :gene-symbol="editedItem.approved_symbol"
            :links-to-show="['clingen', 'gencc', 'search_omim']"
          />
        </v-card-title>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
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
              @gene-data-loaded="handleGeneDataLoaded"
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
      </v-card-actions>
    </v-card>
  </v-dialog>

  <MessageSnackbar
    v-model="snackbarVisible"
    :title="snackbarTitle"
    :message="snackbarMessage"
    :color="snackbarColor"
  />

</template>


<script>
import { ref, watchEffect, watch, computed } from 'vue';
import GeneDetailCard from './GeneDetailCard.vue';
import PrecurationForm from './PrecurationForm.vue';
import CurationForm from './CurationForm.vue'; // Import the CurationForm component
import { getPrecurationByHGNCIdOrSymbol } from '@/stores/precurationsStore';
import GeneLinkChips from './GeneLinkChips.vue'; // Import the GeneLinkChips component

export default {
  components: {
    GeneDetailCard,
    PrecurationForm,
    CurationForm,
    GeneLinkChips
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
      default: 'gene' // Default context, can be 'gene', 'precuration', or 'curation'
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isOpen = ref(props.open);
    const editedItem = ref({ ...props.item });
    const showGeneDetailCard = ref(true); // Controls the visibility of the gene detail card
    const showPreCurationTab = ref(true); // Controls the visibility of the precuration tab
    const showCurationTab = ref(false); // Controls the visibility of the curation tab
    const tab = ref(0); // Controls the active tab

    const snackbarVisible = ref(false);
    const snackbarMessage = ref('');
    const snackbarTitle = ref(''); // Add title state
    const snackbarColor = ref('success');

    const showSnackbar = (title, message, color = 'success') => {
      snackbarTitle.value = title; // Set title
      snackbarMessage.value = message;
      snackbarColor.value = color;
      snackbarVisible.value = true;
    };

    watchEffect(() => {
      isOpen.value = props.open;
      editedItem.value = { ...props.item };
    });

    const handlePrecurationAccepted = () => {
      if (props.context === 'precuration') {
        // If the context is 'precuration', just close the modal
        close();
      } else {
        // Otherwise, switch to the curation tab
        showCurationTab.value = true;
        tab.value = 1;
      }
    };

    const close = () => emit('close');

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

    // State to store fetched gene data
    const geneData = ref(null); // State to store fetched gene data

    const handleGeneDataLoaded = (data) => {
      geneData.value = data; // Store the fetched gene data
      // Pass the gene data to other components as needed
      // For example, you can now pass this data to PrecurationForm and CurationForm
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
      handlePrecurationAccepted,
      showGeneDetailCard,
      showPreCurationTab,
      showCurationTab,
      tab,
      showSnackbar,
      snackbarVisible,
      snackbarMessage,
      snackbarTitle,
      snackbarColor,
      title,
      handleGeneDataLoaded,
      geneData
    };
  },
};
</script>


<style scoped>
/* Add styles if needed */
</style>
