import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useMovieStore = defineStore('movie', () => {
  const movies = ref([])
  const currentMovie = ref(null)
  const loading = ref(false)

  async function fetchMovies(genre = null) {
    loading.value = true
    try {
      const params = { isActive: true }
      if (genre) params.genre = genre
      const response = await api.get('/movies', { params })
      movies.value = response.data
    } finally {
      loading.value = false
    }
  }

  async function getMovieById(id) {
    const response = await api.get(`/movies/${id}`)
    currentMovie.value = response.data
    return response.data
  }

  async function createMovie(movieData) {
    const response = await api.post('/movies', movieData)
    movies.value.push(response.data)
    return response.data
  }

  async function updateMovie(id, movieData) {
    const response = await api.put(`/movies/${id}`, movieData)
    const index = movies.value.findIndex(m => m._id === id)
    if (index !== -1) {
      movies.value[index] = response.data
    }
    return response.data
  }

  async function deleteMovie(id) {
    await api.delete(`/movies/${id}`)
    movies.value = movies.value.filter(m => m._id !== id)
  }

  return {
    movies,
    currentMovie,
    loading,
    fetchMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
  }
})
