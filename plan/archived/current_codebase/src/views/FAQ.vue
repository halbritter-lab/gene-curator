<template>
  <StaticContent :config="faqConfig" />
</template>

<script>
import StaticContent from "@/components/StaticContent.vue";
import faqConfig from "@/config/faqPageConfig.json";

export default {
  name: 'FAQPage',
  components: {
    StaticContent
  },
  data() {
    return {
      faqConfig
    };
  }
};
</script>
