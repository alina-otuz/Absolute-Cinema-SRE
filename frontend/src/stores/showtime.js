import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useShowtimeStore = defineStore('showtime', () => {
  const showtimes = ref([])
  const currentShowtime = ref(null)
  const loading = ref(false)

  async function fetchShowtimes() {
    loading.value = true
    try {
      const response = await api.get('/showtimes')
      showtimes.value = response.data
    } finally {
      loading.value = false
    }
  }

  async function getShowtimeById(id) {
    const response = await api.get(`/showtimes/${id}`)
    currentShowtime.value = response.data
    return response.data
  }

  async function createShowtime(showtimeData) {
    const response = await api.post('/showtimes', showtimeData)
    showtimes.value.push(response.data)
    return response.data
  }

  async function updateShowtime(id, showtimeData) {
    const response = await api.put(`/showtimes/${id}`, showtimeData)
    const index = showtimes.value.findIndex(s => s._id === id)
    if (index !== -1) {
      showtimes.value[index] = response.data
    }
    return response.data
  }

  async function deleteShowtime(id) {
    await api.delete(`/showtimes/${id}`)
    showtimes.value = showtimes.value.filter(s => s._id !== id)
  }

  return {
    showtimes,
    currentShowtime,
    loading,
    fetchShowtimes,
    getShowtimeById,
    createShowtime,
    updateShowtime,
    deleteShowtime
  }
})
