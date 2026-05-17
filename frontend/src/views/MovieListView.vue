<template>
  <div>
    <h1 class="text-4xl font-bold mb-8">Movies</h1>
    
    <div v-if="movieStore.loading" class="text-center text-gray-400">Loading movies...</div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link 
        v-for="movie in movieStore.movies" 
        :key="movie._id"
        :to="`/movies/${movie._id}`"
        class="card hover:border-blue-500 transition-colors cursor-pointer"
      >
        <div v-if="movie.posterUrl" class="mb-4 h-48 bg-slate-700 rounded overflow-hidden">
          <img :src="movie.posterUrl" :alt="movie.title" class="w-full h-full object-cover">
        </div>
        
        <h3 class="text-xl font-bold mb-2">{{ movie.title }}</h3>
        
        <p class="text-gray-400 text-sm mb-2">{{ movie.genre }} • {{ movie.duration }}m</p>
        <p class="text-yellow-500 font-bold mb-2">⭐ {{ movie.rating.toFixed(1) }}</p>
        <p class="text-gray-300 text-sm line-clamp-2">{{ movie.description }}</p>
      </router-link>
    </div>
    
    <div v-if="!movieStore.loading && movieStore.movies.length === 0" class="text-center text-gray-400">
      No movies available
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMovieStore } from '../stores/movie'

const movieStore = useMovieStore()

onMounted(() => {
  movieStore.fetchMovies()
})
</script>
