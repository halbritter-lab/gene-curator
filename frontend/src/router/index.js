import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// Lazy-loaded components
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const GenesTable = () => import('@/views/GenesTable.vue')
const GeneDetail = () => import('@/views/GeneDetail.vue')
const GeneAdmin = () => import('@/views/GeneAdmin.vue')
const UserProfile = () => import('@/views/UserProfile.vue')
const UserManagement = () => import('@/views/UserManagement.vue')
const About = () => import('@/views/About.vue')
const FAQ = () => import('@/views/FAQ.vue')
const PrecurationsTable = () => import('@/views/PrecurationsTable.vue')
const PrecurationDetail = () => import('@/views/PrecurationDetail.vue')
const CreatePrecuration = () => import('@/views/CreatePrecuration.vue')
const CurationsTable = () => import('@/views/CurationsTable.vue')
const CurationDetail = () => import('@/views/CurationDetail.vue')
const CreateCuration = () => import('@/views/CreateCuration.vue')
const NotAuthorized = () => import('@/views/NotAuthorized.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Gene Curator' }
  },
  {
    path: '/login',
    name: 'Login', 
    component: Login,
    meta: { 
      title: 'Login',
      requiresGuest: true // Redirect authenticated users away
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { 
      title: 'Register',
      requiresGuest: true
    }
  },
  {
    path: '/genes',
    name: 'Genes',
    component: GenesTable,
    meta: { 
      title: 'Genes',
      requiresAuth: false // Public access for viewing
    }
  },
  {
    path: '/genes/:id',
    name: 'GeneDetail',
    component: GeneDetail,
    props: true,
    meta: { 
      title: 'Gene Details',
      requiresAuth: false
    }
  },
  {
    path: '/admin/genes',
    name: 'GeneAdmin',
    component: GeneAdmin,
    meta: { 
      title: 'Gene Administration',
      requiresAuth: true,
      requiredRoles: ['admin'] // Only admins can manage genes (bulk upload/delete)
    }
  },
  {
    path: '/precurations',
    name: 'Precurations',
    component: PrecurationsTable,
    meta: { 
      title: 'Pre-curations',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/precurations/create',
    name: 'CreatePrecuration',
    component: CreatePrecuration,
    meta: { 
      title: 'Create Pre-curation',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/precurations/:id',
    name: 'PrecurationDetail',
    component: PrecurationDetail,
    props: true,
    meta: { 
      title: 'Pre-curation Details',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/curations',
    name: 'Curations',
    component: CurationsTable,
    meta: { 
      title: 'Curations',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/curations/create',
    name: 'CreateCuration',
    component: CreateCuration,
    meta: { 
      title: 'Create Curation',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/curations/:id',
    name: 'CurationDetail',
    component: CurationDetail,
    props: true,
    meta: { 
      title: 'Curation Details',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { 
      title: 'User Profile',
      requiresAuth: true
    }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { 
      title: 'User Management',
      requiresAuth: true,
      requiredRoles: ['admin']
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: 'About' }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ,
    meta: { title: 'FAQ' }
  },
  {
    path: '/not-authorized',
    name: 'NotAuthorized',
    component: NotAuthorized,
    meta: { title: 'Not Authorized' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth store if not already done
  if (!authStore.isAuthenticated && authStore.token) {
    try {
      await authStore.initialize()
    } catch (error) {
      console.warn('Auth initialization failed:', error)
    }
  }

  // Update document title
  document.title = to.meta.title ? `${to.meta.title} | Gene Curator` : 'Gene Curator'

  // Handle guest-only routes (login, register)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'Home' })
  }

  // Handle protected routes
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    }

    // Check role requirements
    if (to.meta.requiredRoles) {
      const hasRequiredRole = to.meta.requiredRoles.some(role => authStore.hasRole(role))
      if (!hasRequiredRole) {
        return next({ name: 'NotAuthorized' })
      }
    }
  }

  next()
})

export default router