// router/index.js
import { createWebHistory, createRouter } from "vue-router";
import Genes from "@/views/GenesTable.vue";
import UploadGenes  from '@/views/GeneAdmin.vue'; // Adjust the path as necessary
import GeneDetail from "@/views/GeneDetail.vue"; // Import the new component

const routes = [
  {
    path: "/",
    name: "Genes",
    component: Genes,
  },
  {
    path: '/upload',
    name: 'UploadGenes',
    component: UploadGenes,
  },
  {
    path: '/gene/:id', // :id is a route parameter
    name: 'GeneDetail',
    component: GeneDetail,
    props: true, // Pass route params as props to the component
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;