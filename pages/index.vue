<template>
  <div class="min-h-screen bg-black text-white p-8">
    <!-- Login Section for unauthenticated users -->
    <div v-if="!isAuthenticated()" class="flex flex-col items-center justify-center min-h-screen">
      <!-- Spotify Logo -->
      <div class="mb-12">
        <svg class="w-64" viewBox="0 0 1134 340" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-32-19-76-28-141-27-42 1-48 8-54 8zm189 91c-16 0-33-7-33-20 0-12 17-20 33-20 16 0 33 8 33 20 0 13-17 20-33 20zm-111-41c-9 3-18-9-9-13 49-14 163-10 205 17 11 7-1 22-12 14-40-26-144-21-184-18z" />
        </svg>
      </div>

      <div class="text-center max-w-md">
        <h1 class="text-4xl font-bold mb-6">Welcome to Spotify Clone</h1>
        <p class="text-gray-400 mb-8">Connect with Spotify to access your music library, playlists, and more.</p>
        <button
          @click="login"
          class="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-colors text-lg font-semibold flex items-center justify-center space-x-2 mx-auto"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span>Connect with Spotify</span>
        </button>
      </div>
    </div>

    <!-- Recently Played Section for authenticated users -->
    <div v-else>
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