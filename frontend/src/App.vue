<template>
  <div class="min-h-screen bg-gray-900">
    <nav class="bg-slate-800 border-b border-slate-700">
      <div class="container flex items-center justify-between py-4">
        <router-link to="/" class="text-2xl font-bold text-blue-500">🎬 Cinema</router-link>
        
        <div class="flex gap-4">
          <router-link to="/movies" class="text-gray-300 hover:text-white">Movies</router-link>
          
          <template v-if="authStore.isAuthenticated">
            <router-link to="/my-bookings" class="text-gray-300 hover:text-white">My Bookings</router-link>
            
            <router-link v-if="authStore.isAdmin" to="/admin" class="text-yellow-500 hover:text-yellow-400">Admin</router-link>
            
            <router-link to="/profile" class="text-gray-300 hover:text-white">Profile</router-link>
            
            <button @click="logout" class="btn btn-secondary">Logout</button>
          </template>
          
          <template v-else>
            <router-link to="/login" class="text-gray-300 hover:text-white">Login</router-link>
            <router-link to="/register" class="button btn-primary">Register</router-link>
          </template>
        </div>
      </div>
    </nav>

    <main class="container py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// Check auth on mount
authStore.checkAuth()
</script>
