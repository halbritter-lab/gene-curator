<!-- views/GenesDetail.vue -->
<template>
  <v-container>
    <GeneDetailCard :id="id" />
  </v-container>
</template>

<script>
import GeneDetailCard from '@/components/GeneDetailCard.vue'; // Adjust the path accordingly

export default {
  components: {
    GeneDetailCard
  },
  props: {
    id: String,
  }
};
</script>
