import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userEmail: localStorage.getItem('userEmail') || ''
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    async login(email, password) {
      const res = await api.post('/auth/login', { email, password })
      const token = res.data?.access_token
      const userEmail = res.data?.user?.email || email

      this.token = token
      this.userEmail = userEmail

      localStorage.setItem('token', token)
      localStorage.setItem('userEmail', userEmail)
    },
    logout() {
      this.token = ''
      this.userEmail = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userEmail')
    }
  }
})
