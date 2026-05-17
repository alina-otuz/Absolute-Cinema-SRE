<template>
  <div class="text-center py-12">
    <!-- Idempotency Validation Banner -->
    <div class="bg-gradient-to-r from-green-900 to-emerald-900 border-2 border-green-500 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
      <p class="text-green-400 font-semibold text-lg mb-2">✓ Idempotency Validated</p>
      <p class="text-green-200">Playbook reapplied successfully. Configuration is consistent and idempotent!</p>
      <p class="text-green-300 text-sm mt-2">Updated: {{ new Date().toLocaleString() }}</p>
    </div>

    <h1 class="text-5xl font-bold mb-4">Welcome to Cinema Booking</h1>
    <p class="text-xl text-gray-400 mb-8">Book your favorite movies today!</p>
    
    <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn btn-primary text-lg px-6 py-3 mr-4">
      Login
    </router-link>
    
    <router-link to="/movies" class="btn btn-secondary text-lg px-6 py-3">
      Browse Movies
    </router-link>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>
