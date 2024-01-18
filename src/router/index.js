// router/index.js

// Import Vue and Vue Router
import { createWebHistory, createRouter } from "vue-router";
import { getUserByEmail } from "@/stores/usersStore";

// Import all views here
const HomePage = () => import('@/views/HomePage.vue');
const FAQ = () => import('@/views/FAQ.vue');
const About = () => import('@/views/About.vue');
const Genes = () => import('@/views/GenesTable.vue');
const UploadGenes = () => import('@/views/GeneAdmin.vue');
const GeneDetail = () => import('@/views/GeneDetail.vue');
const Login = () => import('@/views/LoginUser.vue');
const Register = () => import('@/views/RegisterUser.vue');
const UserPage = () => import('@/views/UserPage.vue');
const NotAuthorized = () => import('@/views/NotAuthorized.vue');
const PageNotFound = () => import('@/views/PageNotFound.vue');
const UserAdminView = () => import('@/views/UserAdminView.vue');
const PreCurationTable = () => import('@/views/PreCurationTable.vue');
const CurationTable = () => import('@/views/CurationTable.vue');

// Define routes
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
    meta: { requiresAuth: true, requiredRole: ['admin'] }
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
    path: '/useradmin',
    name: 'UserAdminView',
    component: UserAdminView,
    meta: { requiresAuth: true, requiredRole: ['admin'] }
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
  },
  {
    path: '/precurations',
    name: 'PreCuration',
    component: PreCurationTable,
    meta: { requiresAuth: true, requiredRole: ['admin', 'curator'] }
  },
  {
    path: '/curations',
    name: 'Curation',
    component: CurationTable,
    meta: { requiresAuth: true, requiredRole: ['admin', 'curator'] }
  },
  // Add any additional routes here
];

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === "production" ? "/gene-curator/" : "/"), // set base URL for GitHub Pages
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRoles = to.meta.requiredRole; // This is now expected to be an array
  const currentUser = JSON.parse(localStorage.getItem('user'));

  if (requiresAuth && !currentUser) {
    // User is not authenticated, redirect to login page
    next({ name: 'Login' });
  } else if (requiresAuth && requiredRoles) {
    try {
      // Fetch user data from the database to get the latest role information
      const userData = await getUserByEmail(currentUser.email);
      if (userData && requiredRoles.includes(userData.role)) {
        // User has one of the required roles, proceed to the route
        next();
      } else {
        // User does not have any of the required roles, redirect to 'Not Authorized' page
        next({ name: 'NotAuthorized' });
      }
    } catch (error) {
      // Handle errors that occur while fetching user data
      console.error('Error fetching user role:', error);
      next({ name: 'NotAuthorized' });
    }
  } else {
    // No specific role required, proceed to the route
    next();
  }
});

export default router;
