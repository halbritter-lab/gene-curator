<!-- components/GeneDetailCard.vue -->
<template>
  <v-container>
    <v-card v-if="gene" class="mx-auto my-4" max-width="800">
      <v-card-title class="headline">{{ gene.approved_symbol }}</v-card-title>
      <v-card-text>
        <v-table dense>
          <tbody>
            <template v-for="(value, key) in formattedGeneDetails" :key="key">
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
import { geneDetailsConfig as config } from '@/config/geneDetailsConfig'; // Adjust the path accordingly

export default {
  props: {
    id: String,
  },
  setup(props) {
    const gene = ref(null);

    onMounted(async () => {
      if (props.id) {
        try {
          gene.value = await getGeneByHGNCIdOrSymbol(props.id);
        } catch (error) {
          console.error(error.message);
        }
      }
    });

    const formattedGeneDetails = computed(() => {
      if (!gene.value) return [];

      return Object.keys(config).map(key => {
        const value = gene.value[key];
        return {
          label: config[key].label,
          description: config[key].description,
          formattedValue: formatValue(value, key)
        };
      }).filter(detail => detail.formattedValue !== undefined);
    });

    // for now objects and arrays are formatted into a readable string format
    // TODO: add support for formatting objects and arrays into a table
    const formatValue = (value, key) => {
      const fieldConfig = config[key];
      if (!fieldConfig) return JSON.stringify(value);

      switch (fieldConfig.format) {
        case 'date':
          return value && new Date(value.seconds * 1000).toLocaleDateString();
        case 'number':
          return value && parseFloat(value).toFixed(2);
        case 'array':
        case 'map':
          return JSON.stringify(value);
        case 'text':
        default:
          if (typeof value === 'string' && value.startsWith('http')) {
            return `<a href="${value}" target="_blank">${value}</a>`;
          }
          return value && value.toString();
      }
    };

    return { gene, formattedGeneDetails };
  },
};
</script>


<style scoped>
/* Styles for hoverable labels */
.label-hover {
  cursor: pointer;
  text-decoration: underline; /* Optional, for visual indication */
}
</style>