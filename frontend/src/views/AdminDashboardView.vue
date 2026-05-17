<template>
  <div>
    <h1 class="text-4xl font-bold mb-8">Admin Dashboard</h1>
    
    <!-- Tab Navigation -->
    <div class="flex gap-4 mb-8 border-b border-slate-700">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-4 py-2 font-bold',
          activeTab === tab
            ? 'text-blue-500 border-b-2 border-blue-500'
            : 'text-gray-400 hover:text-white'
        ]"
      >
        {{ tab }}
      </button>
    </div>
    
    <!-- Manage Movies Tab -->
    <div v-if="activeTab === 'Movies'">
      <h2 class="text-2xl font-bold mb-4">Manage Movies</h2>
      
      <div class="mb-6 card">
        <h3 class="text-xl font-bold mb-4">Add New Movie</h3>
        <form @submit.prevent="addMovie" class="space-y-3 grid grid-cols-2 gap-3">
          <input v-model="movieForm.title" type="text" class="input-field input-field" placeholder="Title" required>
          <input v-model="movieForm.director" type="text" class="input-field" placeholder="Director" required>
          <input v-model.number="movieForm.duration" type="number" class="input-field" placeholder="Duration (min)" required>
          <select v-model="movieForm.genre" class="input-field" required>
            <option value="">Select Genre</option>
            <option>Action</option>
            <option>Comedy</option>
            <option>Drama</option>
            <option>Horror</option>
            <option>Sci-Fi</option>
            <option>Thriller</option>
            <option>Animation</option>
            <option>Romance</option>
          </select>
          <textarea v-model="movieForm.description" class="input-field col-span-2" placeholder="Description" rows="2" required></textarea>
          <input v-model="movieForm.posterUrl" type="url" class="input-field col-span-2" placeholder="Poster URL">
          <button type="submit" class="btn btn-primary col-span-2" :disabled="movieLoading">
            {{ movieLoading ? 'Adding...' : 'Add Movie' }}
          </button>
        </form>
      </div>
      
      <div class="space-y-2">
        <div v-for="movie in movieStore.movies" :key="movie._id" class="card flex justify-between items-center">
          <div>
            <h4 class="font-bold">{{ movie.title }}</h4>
            <p class="text-sm text-gray-400">{{ movie.genre }} • {{ movie.director }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="deleteMovie(movie._id)" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Manage Showtimes Tab -->
    <div v-if="activeTab === 'Showtimes'">
      <h2 class="text-2xl font-bold mb-4">Manage Showtimes</h2>
      
      <div class="mb-6 card">
        <h3 class="text-xl font-bold mb-4">Add New Showtime</h3>
        <form @submit.prevent="addShowtime" class="space-y-3 grid grid-cols-2 gap-3">
          <select v-model="showtimeForm.movieId" class="input-field" required>
            <option value="">Select Movie</option>
            <option v-for="movie in movieStore.movies" :key="movie._id" :value="movie._id">
              {{ movie.title }}
            </option>
          </select>
          <input v-model="showtimeForm.dateTime" type="datetime-local" class="input-field" required>
          <input v-model.number="showtimeForm.price" type="number" step="0.01" class="input-field" placeholder="Price" required>
          <input v-model="showtimeForm.seatsInput" type="text" class="input-field col-span-2" placeholder="Available Seats (comma-separated, e.g., A1,A2,A3,B1,B2)" required>
          <button type="submit" class="btn btn-primary col-span-2" :disabled="showtimeLoading">
            {{ showtimeLoading ? 'Adding...' : 'Add Showtime' }}
          </button>
        </form>
      </div>
      
      <div class="space-y-2">
        <div v-for="showtime in showtimeStore.showtimes" :key="showtime._id" class="card flex justify-between items-center">
          <div>
            <h4 class="font-bold">{{ getMovieTitle(showtime.movieId) }}</h4>
            <p class="text-sm text-gray-400">{{ formatTime(showtime.dateTime) }} • ${{ showtime.price }}</p>
          </div>
          <button @click="deleteShowtime(showtime._id)" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useMovieStore } from '../stores/movie'
import { useShowtimeStore } from '../stores/showtime'

const movieStore = useMovieStore()
const showtimeStore = useShowtimeStore()

const activeTab = ref('Movies')
const tabs = ['Movies', 'Showtimes']
const movieLoading = ref(false)
const showtimeLoading = ref(false)

const movieForm = reactive({
  title: '',
  director: '',
  duration: '',
  genre: '',
  description: '',
  posterUrl: '',
  cast: []
})

const showtimeForm = reactive({
  movieId: '',
  dateTime: '',
  price: '',
  seatsInput: ''
})

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const getMovieTitle = (movieId) => {
  const movie = movieStore.movies.find(m => m._id === movieId)
  return movie ? movie.title : 'Unknown'
}

const addMovie = async () => {
  movieLoading.value = true
  try {
    await movieStore.createMovie({
      ...movieForm,
      releaseDate: new Date().toISOString()
    })
    Object.assign(movieForm, {
      title: '',
      director: '',
      duration: '',
      genre: '',
      description: '',
      posterUrl: '',
      cast: []
    })
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to add movie')
  } finally {
    movieLoading.value = false
  }
}

const deleteMovie = async (id) => {
  if (confirm('Delete this movie?')) {
    try {
      await movieStore.deleteMovie(id)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete movie')
    }
  }
}

const addShowtime = async () => {
  showtimeLoading.value = true
  try {
    const availableSeats = showtimeForm.seatsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    await showtimeStore.createShowtime({
      movieId: showtimeForm.movieId,
      dateTime: showtimeForm.dateTime,
      price: showtimeForm.price,
      availableSeats
    })

    Object.assign(showtimeForm, {
      movieId: '',
      dateTime: '',
      price: '',
      seatsInput: ''
    })
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to add showtime')
  } finally {
    showtimeLoading.value = false
  }
}

const deleteShowtime = async (id) => {
  if (confirm('Delete this showtime?')) {
    try {
      await showtimeStore.deleteShowtime(id)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete showtime')
    }
  }
}

onMounted(async () => {
  await movieStore.fetchMovies()
  await showtimeStore.fetchShowtimes()
})
</script>