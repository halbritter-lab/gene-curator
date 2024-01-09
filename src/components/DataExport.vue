<template>
  <div class="text-center">
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props">
          <v-icon left>mdi-export</v-icon>
          Export
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="handleExport('csv')">
          <v-list-item-title>Export as CSV</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleExport('excel')">
          <v-list-item-title>Export as Excel</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleExport('pdf')">
          <v-list-item-title>Export as PDF</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { ref } from 'vue';
import { exportToCsv, exportToExcel, exportToPdf } from '@/functions/exportFunctions';

export default {
  props: {
    dataToExport: {
      type: Array,
      required: true
    },
    filename: {
      type: String,
      default: 'exported-data'
    }
  },
  setup(props) {
    const exporting = ref(false);

    const handleExport = async (format) => {
      exporting.value = true;
      try {
        switch (format) {
          case 'csv':
            await exportToCsv(props.dataToExport, props.filename);
            break;
          case 'excel':
            await exportToExcel(props.dataToExport, props.filename);
            break;
          case 'pdf':
            await exportToPdf(props.dataToExport, props.filename);
            break;
        }
      } catch (error) {
        console.error('Error during export:', error);
      } finally {
        exporting.value = false;
      }
    };

    return {
      exporting,
      handleExport
    };
  },
};
</script>
