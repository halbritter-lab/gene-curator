import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// Lazy-loaded components
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const ScopeSelection = () => import('@/views/ScopeSelection.vue')
const GenesTable = () => import('@/views/GenesTable.vue')
const GeneDetail = () => import('@/views/GeneDetail.vue')
const GeneAdmin = () => import('@/views/GeneAdmin.vue')
const GeneAssignments = () => import('@/views/GeneAssignments.vue')
const AssignmentDetail = () => import('@/views/AssignmentDetail.vue')
const CreateAssignment = () => import('@/views/CreateAssignment.vue')
const SchemaManagement = () => import('@/views/SchemaManagement.vue')
const SchemaEditor = () => import('@/views/SchemaEditor.vue')
const WorkflowManagement = () => import('@/views/WorkflowManagement.vue')
const ValidationDashboard = () => import('@/views/ValidationDashboard.vue')
const UserProfile = () => import('@/views/UserProfile.vue')
const UserManagement = () => import('@/views/UserManagement.vue')
const About = () => import('@/views/About.vue')
const FAQ = () => import('@/views/FAQ.vue')
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
      requiresGuest: true
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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/scope-selection',
    name: 'ScopeSelection',
    component: ScopeSelection,
    meta: {
      title: 'Select Clinical Scope',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/genes',
    name: 'Genes',
    component: GenesTable,
    meta: {
      title: 'Genes',
      requiresAuth: false
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
      requiredRoles: ['admin']
    }
  },
  {
    path: '/assignments',
    name: 'GeneAssignments',
    component: GeneAssignments,
    meta: {
      title: 'Gene Assignments',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/assignments/create',
    name: 'CreateAssignment',
    component: CreateAssignment,
    meta: {
      title: 'Create Assignment',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/assignments/:id',
    name: 'AssignmentDetail',
    component: AssignmentDetail,
    props: true,
    meta: {
      title: 'Assignment Details',
      requiresAuth: true,
      requiredRoles: ['curator', 'admin']
    }
  },
  {
    path: '/admin/schemas',
    name: 'SchemaManagement',
    component: SchemaManagement,
    meta: {
      title: 'Schema Management',
      requiresAuth: true,
      requiredRoles: ['admin']
    }
  },
  {
    path: '/admin/schemas/:id/edit',
    name: 'SchemaEditor',
    component: SchemaEditor,
    props: true,
    meta: {
      title: 'Schema Editor',
      requiresAuth: true,
      requiredRoles: ['admin']
    }
  },
  {
    path: '/admin/workflows',
    name: 'WorkflowManagement',
    component: WorkflowManagement,
    meta: {
      title: 'Workflow Management',
      requiresAuth: true,
      requiredRoles: ['admin']
    }
  },
  {
    path: '/validation',
    name: 'ValidationDashboard',
    component: ValidationDashboard,
    meta: {
      title: 'Validation Dashboard',
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
