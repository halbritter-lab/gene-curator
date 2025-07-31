<!-- components/DataDisplayTable.vue -->
<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      v-model:items-per-page="itemsPerPage"
      :server-items-length="totalItems"
      :loading="loading"
      class="elevation-1"
      density="compact"
    >
      <!-- Header slot -->
      <template v-for="h in headers" v-slot:[`header.${h.value}`]="{ header }" :key="h.value">
            <span>{{h.title}}</span>
            <v-tooltip
              v-bind:header="header"
              v-if="h.description"
              activator="parent"
              location="top"
            >
              {{ h.description }}
            </v-tooltip>
      </template>

      <!-- Default slot for items -->
      <template v-for="column in config.columns" v-slot:[`item.${column.name}`]="{ item }" :key="column.name">
        <!-- Handle text formatting -->
        <div v-if="column.type === 'text'">
          {{ item[column.name] }}
        </div>
        <!-- Handle date formatting -->
        <div v-else-if="column.type === 'date'">
          {{ formatTimestamp(item[column.name]) }}
        </div>
        <!-- Handle link formatting -->
        <router-link v-else-if="column.type === 'link'" :to="column.to(item)">
          {{ item[column.name] }}
        </router-link>
        <!-- Handle boolean formatting -->
        <template v-else-if="column.type === 'slot'">
          <slot :name="column.slotName" :item="item"></slot>
        </template>
      </template>
    </v-data-table>
    
    <!-- Modal slot -->
    <slot name="modal"></slot>

    <!-- Pagination controls -->
    <v-pagination
      v-model="page"
      :length="totalPages"
      @update:page="$emit('update-page', page)"
    ></v-pagination>
  </v-container>
</template>

<script>
import { ref, computed, watch } from 'vue';

/**
 * A generic data table component for displaying items with configurable columns
 * and pagination.
 */
export default {
  props: {
    headers: Array, // The headers for the table
    items: Array, // The items to display in the table
    config: Object, // Configuration for the columns
    totalItems: Number, // Total number of items for pagination
    loading: Boolean, // Loading state
  },
  setup(props, { emit }) {
    const page = ref(1); // Current page number
    const itemsPerPage = ref(10); // Number of items per page

    // Compute the total number of pages
    const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPage.value));

    // Method to format Firestore Timestamp
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString(); // Adjust format as needed
    };

    // Watch for changes in page and itemsPerPage and emit events
    watch(page, () => {
      emit('page-changed', page.value);
    });

    watch(itemsPerPage, () => {
      emit('items-per-page-changed', itemsPerPage.value);
    });

    return {
      page,
      itemsPerPage,
      totalPages,
      formatTimestamp
    };
  },
};
</script>
