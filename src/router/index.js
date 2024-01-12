// router/index.js
import { createWebHistory, createRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import HomePage from "@/views/HomePage.vue";
import FAQ from "@/views/FAQ.vue";
import About from "@/views/About.vue";
import Genes from "@/views/GenesTable.vue";
import UploadGenes from '@/views/GeneAdmin.vue';
import GeneDetail from "@/views/GeneDetail.vue";
import Login from "@/views/LoginUser.vue";
import Register from "@/views/RegisterUser.vue";
import UserPage from '@/views/UserPage.vue';
import NotAuthorized from '@/views/NotAuthorized.vue'; // Import NotAuthorized component
import PageNotFound from '@/views/PageNotFound.vue'; // Import PageNotFound component

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
    meta: { requiresAuth: true, requiredRole: 'admin' }
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
    component: UserPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/not-authorized',
    name: 'NotAuthorized',
    component: NotAuthorized
  },
  {
    path: '/:catchAll(.*)', // Catch-all route
    name: 'PageNotFound',
    component: PageNotFound
  }
  // Add any additional routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.meta.role;
  const isAuthenticated = getAuth().currentUser;
  const userRole = localStorage.getItem('userRole'); // Assuming the role is stored in local storage

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (requiresAuth && requiredRole && userRole !== requiredRole) {
    next({ name: 'NotAuthorized' });
  } else {
    next();
  }
});

export default router;
