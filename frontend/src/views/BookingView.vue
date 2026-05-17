<template>
  <div class="max-w-lg mx-auto card">
    <h2 class="text-3xl font-bold mb-6">Book Tickets</h2>
    
    <div v-if="showtime" class="space-y-6">
      <div class="p-4 bg-slate-700 rounded">
        <p class="text-gray-400 mb-2">{{ formatTime(showtime.dateTime) }}</p>
        <p class="font-bold text-blue-500">${{ showtime.price }} per ticket</p>
        <p class="text-sm text-gray-400">Available: {{ showtime.availableSeats?.length || 0 }} seats</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Select Seats</label>
        <div class="grid grid-cols-5 gap-2 mb-4">
          <button
            v-for="seat in allSeats"
            :key="seat"
            @click="toggleSeat(seat)"
            :class="[
              'p-2 rounded font-bold',
              selectedSeats.includes(seat)
                ? 'bg-blue-600 text-white'
                : !showtime.availableSeats.includes(seat)
                ? 'bg-red-600 text-gray-400 cursor-not-allowed'
                : 'bg-slate-700 hover:bg-slate-600'
            ]"
            :disabled="!showtime.availableSeats.includes(seat)"
          >
            {{ seat }}
          </button>
        </div>
        <p class="text-sm text-gray-400">Selected: {{ selectedSeats.length }} ticket(s)</p>
      </div>
      
      <div class="p-4 bg-blue-600 rounded">
        <p class="text-lg font-bold">Total: ${{ (selectedSeats.length * showtime.price).toFixed(2) }}</p>
      </div>
      
      <button
        @click="confirmBooking"
        :disabled="selectedSeats.length === 0 || booking"
        class="btn btn-primary w-full"
      >
        {{ booking ? 'Processing...' : 'Confirm Booking' }}
      </button>
      
      <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      <p v-if="success" class="text-green-500 text-center">{{ success }}</p>
    </div>
    
    <div v-else class="text-gray-400 text-center">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShowtimeStore } from '../stores/showtime'
import { useBookingStore } from '../stores/booking'

const route = useRoute()
const router = useRouter()
const showtimeStore = useShowtimeStore()
const bookingStore = useBookingStore()

const showtime = ref(null)
const selectedSeats = ref([])
const allSeats = ref([])
const booking = ref(false)
const error = ref('')
const success = ref('')

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const toggleSeat = (seat) => {
  const index = selectedSeats.value.indexOf(seat)
  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    selectedSeats.value.push(seat)
  }
}

const confirmBooking = async () => {
  booking.value = true
  error.value = ''
  success.value = ''
  
  try {
    await bookingStore.createBooking(route.params.showtimeId, selectedSeats.value)
    success.value = 'Booking confirmed!'
    setTimeout(() => router.push('/my-bookings'), 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Booking failed'
  } finally {
    booking.value = false
  }
}

onMounted(async () => {
  await showtimeStore.getShowtimeById(route.params.showtimeId)
  showtime.value = showtimeStore.currentShowtime
  
  if (showtime.value) {
    // Generate all possible seat codes (A1-A10, B1-B10, etc.)
    allSeats.value = []
    for (let row = 0; row < 5; row++) {
      for (let col = 1; col <= 5; col++) {
        allSeats.value.push(String.fromCharCode(65 + row) + col)
      }
    }
  }
})
</script>
