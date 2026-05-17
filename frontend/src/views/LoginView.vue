<template>
  <div class="max-w-md mx-auto card">
    <h2 class="text-3xl font-bold mb-6 text-center">Login</h2>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input v-model="email" type="email" class="input-field" required>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Password</label>
        <input v-model="password" type="password" class="input-field" required>
      </div>
      
      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
      
      <p class="text-center text-gray-400">
        Don't have an account? 
        <router-link to="/register" class="text-blue-500 hover:text-blue-400">Register</router-link>
      </p>
      
      <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
