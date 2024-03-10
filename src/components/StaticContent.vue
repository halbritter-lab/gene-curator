<template>
  <v-container>
    <h1>{{ config.title }}</h1>
    <v-row>
      <v-col v-for="section in config.sections" :key="section.header" cols="12">
        <v-card>
          <v-img v-if="section.image" :src="section.image" class="section-image"></v-img>
          <v-card-title>{{ section.header }}</v-card-title>
          <v-card-text v-html="section.content"></v-card-text>
          <!-- Only display the card actions if there are links -->
          <v-card-actions v-if="section.links && section.links.length > 0">
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
/* Add custom styles here */
</style>
