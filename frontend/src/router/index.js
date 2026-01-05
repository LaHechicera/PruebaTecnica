import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import RecordsView from '../views/RecordsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/records' },
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/records', name: 'records', component: RecordsView }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.public) return true

  if (!auth.isAuthenticated) {
    return { name: 'login' }
  }

  return true
})

export default router
