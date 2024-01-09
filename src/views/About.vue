<template>
  <StaticContent :config="aboutConfig" />
</template>

<script>
import StaticContent from "@/components/StaticContent.vue";
import aboutConfig from "@/config/aboutPageConfig.json";

export default {
  name: 'AboutPage',
  components: {
    StaticContent
  },
  data() {
    return {
      aboutConfig
    };
  }
};
</script>
