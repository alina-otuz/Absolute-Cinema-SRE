import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function register(username, email, password) {
    const response = await api.post('/auth/register', { username, email, password })
    const { accessToken, refreshToken, user: userData } = response.data
    
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    user.value = userData
    
    return userData
  }

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    const { accessToken, refreshToken, user: userData } = response.data
    
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    user.value = userData
    
    return userData
  }

  async function getProfile() {
    const response = await api.get('/users/profile')
    user.value = response.data
    return response.data
  }

  async function updateProfile(username, email, password) {
    const data = {}
    if (username) data.username = username
    if (email) data.email = email
    if (password) data.password = password
    
    const response = await api.put('/users/profile', data)
    user.value = response.data
    return response.data
  }

  function logout() {
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  function checkAuth() {
    const token = localStorage.getItem('accessToken')
    return !!token
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    register,
    login,
    getProfile,
    updateProfile,
    logout,
    checkAuth
  }
})
