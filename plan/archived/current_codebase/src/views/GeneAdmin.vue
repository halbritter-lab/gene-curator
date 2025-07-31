<!-- views/GenesAdmin.vue -->
<template>
  <v-container>
    <h1>Admin Panel: Gene Management</h1>

    <!-- Section for Gene Administration -->
    <section>
      <h2>Gene Admin</h2>
      <v-file-input
        label="Gene Admin"
        @change="handleFileUpload"
        accept=".csv"
      ></v-file-input>
      <v-btn @click="uploadData" :disabled="!csvFile">Upload Data</v-btn>
    </section>
    
      <!-- Overwrite Settings -->
      <v-switch
        v-model="overwriteSettings"
        :label="`Overwrite existing genes: ${overwriteSettings}`"
      ></v-switch>

    <!-- Section for Admin Controls -->
    <section v-if="isAdmin">
      <h2>Administrative Controls</h2>
      <!-- Delete All Genes -->
      <v-btn color="error" @click="confirmDeletion">Delete All Genes</v-btn>

    </section>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { writeGenesFromCSV, deleteAllGenes } from '@/stores/geneStore'; // Import the store functions

export default {
  name: 'UploadGenes',
  setup() {
    const csvFile = ref(null);
    const isAdmin = ref(true); // TODO: Replace with real authentication check
    const overwriteSettings = ref(false);

    const handleFileUpload = (event) => {
      csvFile.value = event.target.files[0];
    };

    const uploadData = async () => {
      if (csvFile.value) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target.result;
          try {
            const results = await writeGenesFromCSV(text, ['hgnc_id'], overwriteSettings.value);
            console.log(results);
          } catch (error) {
            console.error("Error uploading CSV:", error);
          }
        };
        reader.readAsText(csvFile.value);
      }
    };

    const confirmDeletion = () => {
      if (confirm("Are you sure you want to delete ALL gene data? This action cannot be undone.")) {
        deleteAllGenes();
      }
    };

    return {
      csvFile,
      handleFileUpload,
      uploadData,
      isAdmin,
      overwriteSettings,
      confirmDeletion,
    };
  },
};
</script>
