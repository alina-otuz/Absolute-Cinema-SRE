<template>
  <div class="max-w-md mx-auto card">
    <h2 class="text-3xl font-bold mb-6 text-center">Register</h2>
    
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Username</label>
        <input v-model="username" type="text" class="input-field" required>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input v-model="email" type="email" class="input-field" required>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Password</label>
        <input v-model="password" type="password" class="input-field" required>
      </div>
      
      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        {{ loading ? 'Loading...' : 'Register' }}
      </button>
      
      <p class="text-center text-gray-400">
        Already have an account? 
        <router-link to="/login" class="text-blue-500 hover:text-blue-400">Login</router-link>
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

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register(username.value, email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
