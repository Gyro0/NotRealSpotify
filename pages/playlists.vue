<template>
  <div class="min-h-screen">
    <h1 class="text-3xl font-bold mb-8">Your Library</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500 p-8">
      {{ error }}
    </div>

    <!-- Playlists Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="playlist in playlists" :key="playlist.id" 
        class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
        @click="navigateToPlaylist(playlist.id)"
      >
        <img 
          v-if="playlist.images?.[0]?.url" 
          :src="playlist.images[0].url" 
          :alt="playlist.name"
          class="w-full aspect-square object-cover rounded mb-4"
        />
        <div v-else class="w-full aspect-square bg-gray-700 rounded mb-4 flex items-center justify-center">
          <span class="text-2xl text-gray-400">{{ playlist.name?.charAt(0)?.toUpperCase() }}</span>
        </div>
        <h3 class="font-medium truncate">{{ playlist.name }}</h3>
        <p class="text-sm text-gray-400">{{ playlist.tracks?.total }} tracks</p>
      </div>
    </div>

    <!-- No Playlists -->
    <div v-if="!isLoading && !error && playlists.length === 0" class="text-center text-gray-400 py-12">
      No playlists found. Create your first playlist!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

interface SpotifyImage {
  url: string
}

interface SpotifyPlaylist {
  id: string
  name: string
  images: SpotifyImage[]
  tracks: {
    total: number
  }
}

const router = useRouter()
const { accessToken, refreshAccessToken } = useAuth()

const playlists = ref<SpotifyPlaylist[]>([])
const isLoading = ref(true)
const error = ref('')

// Fetch user's playlists
const fetchPlaylists = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchPlaylists()
      }
      throw new Error('Failed to fetch playlists')
    }
    
    const data = await response.json()
    playlists.value = data.items
  } catch (err: unknown) {
    console.error('Error fetching playlists:', err)
    error.value = 'Failed to load playlists'
  } finally {
    isLoading.value = false
  }
}

// Navigation function
const navigateToPlaylist = (id: string) => {
  router.push(`/playlist/${id}`)
}

onMounted(async () => {
  if (!accessToken.value) {
    error.value = 'Please log in to view your playlists'
    isLoading.value = false
    return
  }

  await fetchPlaylists()
})
</script> 