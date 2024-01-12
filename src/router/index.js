import { createWebHistory, createRouter } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import FAQ from "@/views/FAQ.vue";
import About from "@/views/About.vue";
import Genes from "@/views/GenesTable.vue";
import UploadGenes from '@/views/GeneAdmin.vue';
import GeneDetail from "@/views/GeneDetail.vue";
import Login from "@/views/LoginUser.vue"; // Import Login component
import Register from "@/views/RegisterUser.vue"; // Import Register component
import UserPage from '@/views/UserPage.vue';

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
    path: '/gene/:id',
    name: 'GeneDetail',
    component: GeneDetail,
    props: true,
  },
  // Define new route for login
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // Define new route for registration
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/user',
    name: 'UserPage',
    component: UserPage
  },
  // Add any additional routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
