<!-- components/GeneLinkChips.vue -->
<template>
  <div class="gene-links">
    <v-chip
        v-for="link in activeLinks"
        :key="link.name"
        @click="goToLink(link.url)"
        size="small"
    >
      {{ link.name }}
    </v-chip>
  </div>
</template>


<script>
import { computed, defineComponent } from 'vue';

/**
 * A component that displays clickable link chips based on provided gene identifiers.
 */
export default defineComponent({
  name: 'GeneLinkChips',
  props: {
    hgncId: {
      type: String,
      default: null
    },
    geneSymbol: {
      type: String,
      default: null
    },
    omimId: {
      type: String,
      default: null
    },
    linksToShow: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    /**
     * Formats the provided ID with or without its prefix (HGNC: or OMIM:).
     * @param {String} id - The ID to be formatted.
     * @param {String} type - The type of ID (HGNC or OMIM).
     * @param {Boolean} includePrefix - Whether to include the prefix in the ID.
     * @returns {String|null} The formatted ID or null if the ID is not provided.
     */
    const formatId = (id, type, includePrefix) => {
      if (!id) return null;
      const prefix = type === 'HGNC' ? 'HGNC:' : type === 'OMIM' ? 'OMIM:' : '';
      if (includePrefix && !id.startsWith(prefix)) {
        return `${prefix}${id}`;
      } else if (!includePrefix && id.startsWith(prefix)) {
        return id.replace(prefix, '');
      }
      return id;
    };

    /**
     * Configuration for generating URL links based on provided IDs.
     */
    const linkConfig = {
      clingen: () => {
        const formattedId = formatId(props.hgncId, 'HGNC', true);
        return formattedId ? `https://search.clinicalgenome.org/kb/genes/${formattedId}` : null;
      },
      gencc: () => {
        const formattedId = formatId(props.hgncId, 'HGNC', true);
        return formattedId ? `https://search.thegencc.org/genes/${formattedId}` : null;
      },
      omim: () => {
        const formattedId = formatId(props.omimId, 'OMIM', false);
        return formattedId ? `https://www.omim.org/entry/${formattedId}` : null;
      },
      search_omim: () => props.geneSymbol ? `https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=${props.geneSymbol}` : null
    };

    /**
     * Computed property to generate an array of active links based on `linksToShow` prop.
     */
    const activeLinks = computed(() => {
      return props.linksToShow.map(linkKey => {
        const url = linkConfig[linkKey] ? linkConfig[linkKey]() : null;
        return {
          name: linkKey,
          url: url
        };
      }).filter(link => link.url);
    });

    /**
     * Opens the provided URL in a new browser tab.
     * @param {String} url - The URL to be opened.
     */
    const goToLink = (url) => {
      if (url) window.open(url, '_blank');
    };

    return {
      activeLinks,
      goToLink
    };
  }
});
</script>


<style scoped>
/**
 * Styles for the gene link chips.
 * Each chip behaves like a hyperlink, with a pointer cursor and color change on hover.
 */
.gene-links .v-chip {
  cursor: pointer; /* Cursor like a link */
  transition: background-color 0.3s ease; /* Smooth transition for background color */
}

.gene-links .v-chip:hover {
  background-color: #1976D2; /* Change color on hover */
  color: white; /* Change text color for better visibility */
}
</style>
