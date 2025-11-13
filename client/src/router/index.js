import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/authService'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true } 
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true } 
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true } 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath } 
      });
    } else {
      next();
    }
  }
  else if (to.meta.requiresGuest) {
    if (isAuthenticated) {
      next('/dashboard');
    } else {
      next();
    }
  }
  else {
    next();
  }
});

export default router