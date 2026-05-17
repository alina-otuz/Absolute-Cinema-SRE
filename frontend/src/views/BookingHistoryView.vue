<template>
  <div>
    <h1 class="text-4xl font-bold mb-8">My Bookings</h1>
    
    <div v-if="bookingStore.loading" class="text-center text-gray-400">Loading bookings...</div>
    
    <div v-else-if="bookingStore.bookings.length" class="space-y-4">
      <div v-for="booking in bookingStore.bookings" :key="booking._id" class="card">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-xl font-bold">
            {{ booking.showtimeId?.movieId || booking.movieTitle || 'Unknown movie' }}
          </h3>
          <span :class="[
            'px-3 py-1 rounded text-sm font-bold',
            (booking.status || '').toLowerCase() === 'confirmed' ? 'bg-green-600' : 'bg-red-600'
          ]">
            {{ (booking.status || '').toUpperCase() }}
          </span>
        </div>
        
        <p class="text-gray-400 mb-2">Seats: {{ (booking.selectedSeats || booking.seats || []).join(', ') }}</p>
        <p class="text-gray-400 mb-2">{{ formatTime(booking.createdAt || booking.bookedAt) }}</p>
        <p class="font-bold text-blue-500 mb-4">${{ booking.totalPrice }}</p>
        
        <button
          v-if="(booking.status || '').toLowerCase() === 'confirmed'"
          @click="cancelBooking(booking._id)"
          class="btn btn-danger"
        >
          Cancel Booking
        </button>
      </div>
    </div>
    
    <div v-else class="text-center text-gray-400">
      <p>No bookings yet</p>
      <router-link to="/movies" class="text-blue-500 hover:text-blue-400">Browse movies</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBookingStore } from '../stores/booking'

const bookingStore = useBookingStore()

const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString()
}

const cancelBooking = async (id) => {
  if (confirm('Cancel this booking?')) {
    try {
      await bookingStore.cancelBooking(id)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking')
    }
  }
}

onMounted(() => {
  bookingStore.fetchBookingHistory()
})
</script>
