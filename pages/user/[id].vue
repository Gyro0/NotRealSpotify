<template>
  <div class="min-h-screen">
    <!-- User Header -->
    <div class="relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
      <div class="relative flex items-end space-x-8 p-8">
        <img 
          v-if="userProfile.images?.[0]?.url" 
          :src="userProfile.images[0].url" 
          :alt="userProfile.display_name"
          class="w-48 h-48 rounded-full object-cover shadow-2xl"
        />
        <div class="flex-1">
          <h1 class="text-5xl font-bold mb-4">{{ userProfile.display_name }}</h1>
          <p class="text-gray-400">{{ userProfile.followers?.total.toLocaleString() }} followers</p>
        </div>
      </div>
    </div>

    <!-- Public Playlists -->
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-6">Public Playlists</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
          <h3 class="font-medium truncate">{{ playlist.name }}</h3>
          <p class="text-sm text-gray-400">{{ playlist.tracks?.total }} tracks</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

interface SpotifyImage {
  url: string
}

interface SpotifyUserProfile {
  id: string
  display_name: string
  images: SpotifyImage[]
  followers: {
    total: number
  }
}

interface SpotifyPlaylist {
  id: string
  name: string
  images: SpotifyImage[]
  tracks: {
    total: number
  }
}

const route = useRoute()
const router = useRouter()
const { accessToken, refreshAccessToken } = useAuth()

const userProfile = ref<SpotifyUserProfile>({} as SpotifyUserProfile)
const playlists = ref<SpotifyPlaylist[]>([])
const isLoading = ref(true)
const error = ref('')

// Fetch user profile
const fetchUserProfile = async () => {
  try {
    const userId = route.params.id
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchUserProfile()
      }
      throw new Error('Failed to fetch user profile')
    }
    
    const data = await response.json()
    userProfile.value = data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    error.value = 'Failed to load user profile'
  }
}

// Fetch user's public playlists
const fetchUserPlaylists = async () => {
  try {
    const userId = route.params.id
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists?limit=50`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchUserPlaylists()
      }
      throw new Error('Failed to fetch playlists')
    }
    
    const data = await response.json()
    playlists.value = data.items
  } catch (error) {
    console.error('Error fetching playlists:', error)
    error.value = 'Failed to load playlists'
  }
}

// Navigation functions
const navigateToPlaylist = (id: string) => {
  router.push(`/playlist/${id}`)
}

onMounted(async () => {
  if (!accessToken.value) {
    error.value = 'Please log in to view user profiles'
    isLoading.value = false
    return
  }

  try {
    await Promise.all([
      fetchUserProfile(),
      fetchUserPlaylists()
    ])
  } catch (error) {
    console.error('Error loading user data:', error)
  } finally {
    isLoading.value = false
  }
})
</script> 