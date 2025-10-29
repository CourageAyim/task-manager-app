import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
// import RegisterView from '../views/RegisterView.vue'
// import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
//   {
//     path: '/register',
//     name: 'Register',
//     component: RegisterView
//   },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: DashboardView,
//     // Future step: meta: { requiresAuth: true }
//   }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


export default router