import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MovieListView from '../views/MovieListView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import BookingView from '../views/BookingView.vue'
import BookingHistoryView from '../views/BookingHistoryView.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/movies',
    name: 'MovieList',
    component: MovieListView
  },
  {
    path: '/movies/:id',
    name: 'MovieDetail',
    component: MovieDetailView
  },
  {
    path: '/booking/:showtimeId',
    name: 'Booking',
    component: BookingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-bookings',
    name: 'BookingHistory',
    component: BookingHistoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
