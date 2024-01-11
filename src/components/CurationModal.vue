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
            <!-- Curation Component Here -->
            <!-- Add your curation component or other content here -->
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
</template>


<script>
import { ref, watchEffect, onMounted } from 'vue';
import GeneDetailCard from './GeneDetailCard.vue';
import PrecurationForm from './PrecurationForm.vue';
import { getPrecurationByHGNCIdOrSymbol } from '@/stores/precurationsStore';

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
    const showCurationTab = ref(false); // Controls the visibility of the curation tab
    const tab = ref(0); // Controls the active tab

    watchEffect(() => {
      isOpen.value = props.open;
      editedItem.value = { ...props.item };
    });

    const handlePrecurationAccepted = (precurationData) => {
      console.log('Precuration accepted:', precurationData);
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
        }
      } catch (error) {
        console.error("Error checking existing curation:", error);
      }
    };

    onMounted(() => {
      checkExistingCuration();
    });

    return {
      isOpen,
      editedItem,
      close,
      save,
      handlePrecurationAccepted,
      showCurationTab,
      tab
    };
  },
};
</script>


<style scoped>
/* Add styles if needed */
</style>
