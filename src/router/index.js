import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView      from '@/views/LoginView.vue'
import HomeView      from '@/views/HomeView.vue'
import RegisterView  from '@/views/RegisterView.vue'
import UsersView     from '@/views/UsersView.vue'
import TurmasView       from '@/views/TurmasView.vue'
import TurmaRegisterView from '@/views/TurmaRegisterView.vue'
import TurmaDetailView   from '@/views/TurmaDetailView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'users',
    component: UsersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/turmas',
    name: 'turmas',
    component: TurmasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/turmas/:id',
    name: 'turma-detail',
    component: TurmaDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/turmas/cadastrar',
    name: 'turma-register',
    component: TurmaRegisterView,
    meta: { requiresAuth: true }
  },
  {
    path: '/cadastrar',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.meta.guest && auth.isLoggedIn) {
    return { name: 'home' }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' }
  }
})

export default router
