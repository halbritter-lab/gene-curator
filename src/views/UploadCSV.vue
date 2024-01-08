<!-- /views/UploadCSV.vue -->
<template>
  <v-container>
    <h1>Upload CSV Data</h1>

    <!-- File input for CSV -->
    <v-file-input
      label="Upload CSV file"
      @change="handleFileUpload"
      accept=".csv"
    ></v-file-input>

    <!-- Button to trigger upload -->
    <v-btn @click="uploadData" :disabled="!csvFile">Upload Data</v-btn>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { writeGenesFromCSV } from '@/stores/geneStore'; // Import the store functions

export default {
  name: 'UploadGenes',
  setup() {
    const csvFile = ref(null);

    const handleFileUpload = (event) => {
      // Store the selected file
      csvFile.value = event.target.files[0];
    };

    const uploadData = async () => {
      if (csvFile.value) {
        // Read the file as text
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target.result;
          // Convert CSV text to JSON and upload to Firestore
          try {
            const results = await writeGenesFromCSV(text);
            console.log(results); // Log the results for now
          } catch (error) {
            console.error("Error uploading CSV:", error);
          }
        };
        reader.readAsText(csvFile.value);
      }
    };

    return {
      csvFile,
      handleFileUpload,
      uploadData,
    };
  },
};
</script>
