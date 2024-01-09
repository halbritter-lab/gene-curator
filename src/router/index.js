// router/index.js
import { createWebHistory, createRouter } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import FAQ from "@/views/FAQ.vue";
import About from "@/views/About.vue";
import Genes from "@/views/GenesTable.vue";
import UploadGenes  from '@/views/GeneAdmin.vue'; // Adjust the path as necessary
import GeneDetail from "@/views/GeneDetail.vue"; // Import the new component

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ
  },
  {
    path: "/genes",
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