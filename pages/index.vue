<template>
  <div class="min-h-screen bg-black text-white p-8 rounded-lg">
    <!-- Login Section for unauthenticated users -->
    <div v-if="!isAuthenticated()" class="flex flex-col items-center justify-center min-h-screen ">
      <!-- Spotify Logo -->
      <div class="mb-12">
        <svg class="w-64" viewBox="0 0 1134 340" xmlns="http://www.w3.org/2000/svg">
          <img src="/spotify-logo.png" alt="Spotify" class="w-64 h-64" />

        </svg>
      </div>

      <div class="text-center max-w-md">
        <h1 class="text-4xl font-bold mb-6">Welcome to "Not Real" Spotify</h1>
        <p class="text-gray-400 mb-8">Connect with Spotify to access your  music library, playlists, and more.</p>
        <button
          @click="login"
          class="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-colors text-lg font-semibold flex items-center justify-center space-x-2 mx-auto"
        >
          <span>Connect with Spotify</span>
        </button>
      </div>
    </div>

    <!-- Recently Played Section for authenticated users -->
    <div v-else >
      <h1 class="text-3xl font-bold mb-8">Recently Played</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in recentlyPlayed" :key="item.track.id" 
          class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          @click="playTrack(item.track.uri)"
        >
          <div class="flex items-center space-x-4">
            <img 
              v-if="item.track.album?.images?.[0]?.url" 
              :src="item.track.album.images[0].url" 
              :alt="item.track.name"
              class="w-16 h-16 rounded object-cover"
            />
            <div class="flex-1 min-w-0">
              <p class="font-medium truncate">{{ item.track.name }}</p>
              <p class="text-sm text-gray-400 truncate">{{ item.track.artists.map(artist => artist.name).join(', ') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSpotifyPlayback } from '~/composables/useSpotifyPlayback'

interface SpotifyArtist {
  name: string
  id: string
}

interface SpotifyImage {
  url: string
  height: number
  width: number
}

interface SpotifyAlbum {
  images: SpotifyImage[]
  name: string
}

interface SpotifyTrack {
  id: string
  name: string
  uri: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
}

interface RecentlyPlayedItem {
  track: SpotifyTrack
  played_at: string
}

const { login, isAuthenticated, accessToken, refreshAccessToken } = useAuth()
const { playTrack } = useSpotifyPlayback()
const recentlyPlayed = ref<RecentlyPlayedItem[]>([])

// Fetch recently played tracks
const fetchRecentlyPlayed = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=12', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchRecentlyPlayed()
      }
      const errorData = await response.json()
      console.error('Recently played API error:', errorData)
      throw new Error(`Failed to fetch recently played tracks: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }
    
    const data = await response.json()
    recentlyPlayed.value = data.items || []
  } catch (error) {
    console.error('Error fetching recently played:', error)
    recentlyPlayed.value = []
  }
}

// Fetch data when component is mounted
onMounted(() => {
  if (isAuthenticated()) {
    fetchRecentlyPlayed()
  }
})
</script> 