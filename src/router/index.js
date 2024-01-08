// router/index.js
import { createWebHistory, createRouter } from "vue-router";
import Genes from "@/views/GenesTable.vue";
import UploadGenes  from '@/views/GeneAdmin.vue'; // Adjust the path as necessary

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;