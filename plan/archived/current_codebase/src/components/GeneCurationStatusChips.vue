<!-- components/GeneCurationStatusChips.vue -->
<template>
  <div class="curation-status-chips">
    <v-chip
      v-if="hasPrecuration"
      color="blue"
      size="small"
    >
      Precuration ({{ precurationCount }})
    </v-chip>

    <v-chip
      v-if="hasCuration"
      color="green"
      size="small"
    >
      Curation ({{ curationCount }})
    </v-chip>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'GeneCurationStatusChips',
  props: {
    gene: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const hasPrecuration = computed(() => Array.isArray(props.gene.hasPrecuration) && props.gene.hasPrecuration.length > 0);
    const hasCuration = computed(() => Array.isArray(props.gene.hasCuration) && props.gene.hasCuration.length > 0);

    const precurationCount = computed(() => props.gene.hasPrecuration ? props.gene.hasPrecuration.length : 0);
    const curationCount = computed(() => props.gene.hasCuration ? props.gene.hasCuration.length : 0);

    return {
      hasPrecuration,
      hasCuration,
      precurationCount,
      curationCount
    };
  }
});
</script>

<style scoped>
/* Add styling as needed */
</style>
