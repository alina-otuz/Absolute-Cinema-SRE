import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref([])
  const currentBooking = ref(null)
  const loading = ref(false)

  async function fetchBookingHistory() {
    loading.value = true
    try {
      const response = await api.get('/bookings')
      bookings.value = response.data
    } finally {
      loading.value = false
    }
  }

  async function getBookingById(id) {
    const response = await api.get(`/bookings/${id}`)
    currentBooking.value = response.data
    return response.data
  }

  async function createBooking(showtimeId, seats) {
    const response = await api.post('/bookings', { showtimeId, selectedSeats: seats })
    bookings.value.push(response.data)
    return response.data
  }

  async function cancelBooking(id) {
    const response = await api.put(`/bookings/${id}/cancel`)
    const index = bookings.value.findIndex(b => b._id === id)
    if (index !== -1) {
      bookings.value[index] = response.data
    }
    return response.data
  }

  return {
    bookings,
    currentBooking,
    loading,
    fetchBookingHistory,
    getBookingById,
    createBooking,
    cancelBooking
  }
})
