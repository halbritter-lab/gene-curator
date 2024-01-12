<!-- views/HomePage.vue -->
<template>
  <StaticContent :config="startPageConfig" />
</template>

<script>
import StaticContent from '@/components/StaticContent.vue';
import startPageConfig from '@/config/startPageConfig.json';

export default {
  name: 'HomePage',
  components: {
    StaticContent
  },
  data() {
    return {
      startPageConfig
    };
  }
};
</script>
