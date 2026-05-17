<template>
  <div v-if="movie" class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="md:col-span-1">
      <div v-if="movie.posterUrl" class="card p-0 overflow-hidden mb-4">
        <img :src="movie.posterUrl" :alt="movie.title" class="w-full h-96 object-cover">
      </div>
      
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Showtimes</h3>
        <div v-if="showtimes.length" class="space-y-2">
          <router-link
            v-for="showtime in showtimes"
            :key="showtime._id"
            :to="`/booking/${showtime._id}`"
            class="block p-3 bg-slate-700 rounded hover:bg-blue-600 transition-colors"
          >
            <div class="font-medium">{{ formatTime(showtime.dateTime) }}</div>
            <div class="text-sm text-gray-300">${{ showtime.price }}</div>
          </router-link>
        </div>
        <div v-else class="text-gray-400">No showtimes available</div>
      </div>
    </div>
    
    <div class="md:col-span-2">
      <h1 class="text-4xl font-bold mb-2">{{ movie.title }}</h1>
      
      <div class="flex gap-4 mb-4">
        <span class="bg-blue-600 px-3 py-1 rounded">{{ movie.genre }}</span>
        <span>{{ movie.duration }} minutes</span>
        <span class="text-yellow-500">⭐ {{ movie.rating.toFixed(1) }}</span>
      </div>
      
      <p class="text-gray-300 mb-4">Director: <strong>{{ movie.director }}</strong></p>
      
      <div class="mb-4">
        <h3 class="text-xl font-bold mb-2">Cast</h3>
        <p class="text-gray-300">{{ movie.cast.join(', ') }}</p>
      </div>
      
      <div class="mb-8">
        <h3 class="text-xl font-bold mb-2">Description</h3>
        <p class="text-gray-300">{{ movie.description }}</p>
      </div>
      
      <!-- Reviews Section -->
      <div class="card mb-8">
        <h3 class="text-2xl font-bold mb-4">Reviews</h3>
        
        <div v-if="authStore.isAuthenticated" class="mb-6 p-4 bg-slate-700 rounded">
          <h4 class="font-bold mb-2">Leave a Review</h4>
          <form @submit.prevent="submitReview" class="space-y-3">
            <div>
              <label class="block text-sm mb-1">Rating (1-10)</label>
              <input v-model.number="newReview.rating" type="number" min="1" max="10" class="input-field" required>
            </div>
            <div>
              <label class="block text-sm mb-1">Comment</label>
              <textarea v-model="newReview.comment" class="input-field" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="reviewSubmitting">
              {{ reviewSubmitting ? 'Submitting...' : 'Submit Review' }}
            </button>
          </form>
        </div>
        
        <div v-if="reviewStore.reviews.length" class="space-y-4">
          <div v-for="review in reviewStore.reviews" :key="review._id" class="p-4 bg-slate-700 rounded">
            <div class="flex justify-between items-start mb-2">
              <div>
                <strong>{{ review.userId.username }}</strong>
                <span class="text-yellow-500 ml-2">⭐ {{ review.rating }}</span>
              </div>
              <button 
                v-if="authStore.user?._id === review.userId._id"
                @click="deleteReview(review._id)"
                class="text-red-500 hover:text-red-400 text-sm"
              >
                Delete
              </button>
            </div>
            <p class="text-gray-300">{{ review.comment }}</p>
          </div>
        </div>
        <div v-else class="text-gray-400">No reviews yet</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '../stores/movie'
import { useReviewStore } from '../stores/review'
import { useShowtimeStore } from '../stores/showtime'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const movieStore = useMovieStore()
const reviewStore = useReviewStore()
const showtimeStore = useShowtimeStore()
const authStore = useAuthStore()

const movie = ref(null)
const showtimes = ref([])
const newReview = ref({ rating: 5, comment: '' })
const reviewSubmitting = ref(false)

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const submitReview = async () => {
  reviewSubmitting.value = true
  try {
    await reviewStore.createReview(movie.value._id, newReview.value.rating, newReview.value.comment)
    newReview.value = { rating: 5, comment: '' }
    // Refresh movie to get updated rating
    await movieStore.getMovieById(route.params.id)
  } finally {
    reviewSubmitting.value = false
  }
}

const deleteReview = async (id) => {
  if (confirm('Delete this review?')) {
    await reviewStore.deleteReview(id)
    // Refresh movie to get updated rating
    await movieStore.getMovieById(route.params.id)
  }
}

onMounted(async () => {
  await movieStore.getMovieById(route.params.id)
  movie.value = movieStore.currentMovie
  
  await reviewStore.fetchMovieReviews(route.params.id)
  await showtimeStore.fetchShowtimes()
  showtimes.value = showtimeStore.showtimes.filter(s => s.movieId === movie.value._id)
})
</script>
