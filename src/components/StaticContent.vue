<!-- / components/StaticContent.vue -->
<template>
  <v-container>
    <h1>{{ config.title }}</h1>
    <v-row>
      <v-col v-for="section in config.sections" :key="section.header" cols="12">
        <v-card>
          <v-img v-if="section.image" :src="section.image" class="section-image"></v-img>
          <v-card-title>{{ section.header }}</v-card-title>
          <v-card-text>{{ section.content }}</v-card-text>
          <v-card-actions>
            <v-btn v-for="link in section.links" :key="link.title" :to="link.url" text>{{ link.title }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'StaticContent',
  props: {
    config: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.section-image {
  max-height: 200px; /* Limit the height of images */
  object-fit: cover; /* Ensure images cover the area nicely */
}
</style>
