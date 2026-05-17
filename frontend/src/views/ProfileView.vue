<template>
  <div class="max-w-2xl mx-auto card">
    <h2 class="text-4xl font-bold mb-6">My Profile</h2>
    
    <div v-if="authStore.user" class="space-y-6">
      <div class="p-4 bg-slate-700 rounded">
        <p class="text-gray-400">Email</p>
        <p class="font-bold text-xl">{{ authStore.user.email }}</p>
      </div>
      
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Username</label>
          <input v-model="formData.username" type="text" class="input-field">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">New Email</label>
          <input v-model="formData.email" type="email" class="input-field">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">New Password</label>
          <input v-model="formData.password" type="password" class="input-field" placeholder="Leave empty to keep current">
        </div>
        
        <button type="submit" class="btn btn-primary w-full" :disabled="updating">
          {{ updating ? 'Updating...' : 'Update Profile' }}
        </button>
        
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
        <p v-if="success" class="text-green-500 text-center">{{ success }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const formData = reactive({
  username: '',
  email: '',
  password: ''
})

const error = ref('')
const success = ref('')
const updating = ref(false)

const updateProfile = async () => {
  updating.value = true
  error.value = ''
  success.value = ''
  
  try {
    await authStore.updateProfile(formData.username, formData.email, formData.password)
    formData.password = ''
    success.value = 'Profile updated successfully'
  } catch (err) {
    error.value = err.response?.data?.message || 'Update failed'
  } finally {
    updating.value = false
  }
}

onMounted(async () => {
  await authStore.getProfile()
  if (authStore.user) {
    formData.username = authStore.user.username
    formData.email = authStore.user.email
  }
})
</script>
