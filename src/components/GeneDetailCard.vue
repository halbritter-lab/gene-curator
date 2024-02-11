<!-- components/GeneDetailCard.vue -->
<template>
  <v-container>
    <v-card v-if="gene" class="mx-auto my-4" max-width="800">
      <v-card-title v-if="showTitle" class="headline">{{ gene.approved_symbol }}</v-card-title>
      <v-card-text>
        <v-table dense>
          <tbody>
            <template v-for="(value, key) in filteredGeneDetails" :key="key">
              <tr>
                <td>
                  <strong>
                    <span class="label-hover" :title="value.description">{{ value.label }}</span>
                    <v-tooltip
                      activator="parent"
                      location="start"
                    >
                      {{ value.description }}
                    </v-tooltip>
                  </strong>
                </td>
                <td v-html="value.formattedValue"></td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
    <v-alert v-else type="error">
      Gene not found or failed to load.
    </v-alert>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getGeneByHGNCIdOrSymbol } from '@/stores/geneStore';
import { geneDetailsConfig } from '@/config/workflows/KidneyGeneticsGeneCuration/workflowConfig';

export default {
  props: {
    id: String,
    visibilityScope: {
      type: String,
      default: 'standardView', // or 'curationView'
    },
    showTitle: { // New prop for showing the card title
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const gene = ref(null);

    onMounted(async () => {
      if (props.id) {
        gene.value = await getGeneByHGNCIdOrSymbol(props.id).catch(error => {
          console.error(error.message);
        });
      }
    });

    const filteredGeneDetails = computed(() => {
      if (!gene.value) return [];

      return Object.entries(geneDetailsConfig)
        .filter(([, fieldConfig]) => fieldConfig.visibility[props.visibilityScope])
        .map(([key, fieldConfig]) => {
          const value = gene.value[key];
          return {
            label: fieldConfig.label,
            description: fieldConfig.description || '',
            formattedValue: formatValue(value, fieldConfig),
          };
        });
    });

    // for now objects and arrays are formatted into a readable string format
    // TODO: add support for formatting objects and arrays into a table
    function formatValue(value, fieldConfig) {
      if (value == null) return 'N/A'; // Handle null and undefined values

      switch (fieldConfig.format) {
        case 'date':
          return new Date(value.seconds * 1000).toLocaleDateString();
        case 'number':
          return parseFloat(value).toFixed(2);
        case 'array':
          return value.join(', ');
        case 'map':
          return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
        case 'text':
          return value;
        default:
          return JSON.stringify(value);
      }
    }

    return { gene, filteredGeneDetails };
  },
};
</script>

<style scoped>
.label-hover {
  cursor: help;
}

.v-simple-table {
  max-height: 300px;
  overflow-y: auto;
}
</style>
