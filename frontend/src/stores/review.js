import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useReviewStore = defineStore('review', () => {
  const reviews = ref([])
  const loading = ref(false)

  async function fetchMovieReviews(movieId) {
    loading.value = true
    try {
      const response = await api.get(`/reviews/movie/${movieId}`)
      reviews.value = response.data
    } finally {
      loading.value = false
    }
  }

  async function createReview(movieId, rating, comment) {
    const response = await api.post('/reviews', { movieId, rating, comment })
    reviews.value.push(response.data)
    return response.data
  }

  async function updateReview(id, rating, comment) {
    const response = await api.put(`/reviews/${id}`, { rating, comment })
    const index = reviews.value.findIndex(r => r._id === id)
    if (index !== -1) {
      reviews.value[index] = response.data
    }
    return response.data
  }

  async function deleteReview(id) {
    await api.delete(`/reviews/${id}`)
    reviews.value = reviews.value.filter(r => r._id !== id)
  }

  return {
    reviews,
    loading,
    fetchMovieReviews,
    createReview,
    updateReview,
    deleteReview
  }
})
