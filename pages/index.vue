<template>
  <div>
    <!-- Login Prompt for Unauthenticated Users -->
    <div v-if="!isAuthenticated()" class="min-h-screen flex items-center justify-center bg-black">
      <div class="max-w-md w-full p-8">
        <!-- Login Form -->
        <div class="text-center">
          <h1 class="text-3xl font-bold text-white mb-8">Welcome to Spotify Clone</h1>
          <p class="text-gray-400 mb-8">Log in to access your music, playlists, and more.</p>
          
          <button 
            @click="login"
            class="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-3 px-4 rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Log in with Spotify
          </button>
        </div>
      </div>
    </div>

    <!-- Content for Authenticated Users -->
    <div v-else>
      <!-- Recently Played Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Recently Played</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="item in recentlyPlayed" :key="item.track.id" 
               class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
               @click="playTrack(item.track.uri)">
            <div class="aspect-square relative mb-4">
              <img 
                v-if="item.track.album?.images?.[0]?.url" 
                :src="item.track.album.images[0].url" 
                :alt="item.track.name"
                class="w-full h-full object-cover rounded-lg"
              />
              <div v-else class="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
            <h3 class="font-medium truncate">{{ item.track.name }}</h3>
            <p class="text-sm text-gray-400 truncate">{{ item.track.artists[0].name }}</p>
          </div>
        </div>
      </section>

      <!-- Recommendations Section -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Recommended for You</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="track in recommendations" :key="track.id" 
               class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
               @click="playTrack(track.uri)">
            <div class="aspect-square relative mb-4">
              <img 
                v-if="track.album?.images?.[0]?.url" 
                :src="track.album.images[0].url" 
                :alt="track.name"
                class="w-full h-full object-cover rounded-lg"
              />
              <div v-else class="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
            <h3 class="font-medium truncate">{{ track.name }}</h3>
            <p class="text-sm text-gray-400 truncate">{{ track.artists[0].name }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const { accessToken, isAuthenticated, login } = useAuth()
const { playTrack } = useSpotifyPlayback()
const recentlyPlayed = ref<RecentlyPlayedItem[]>([])
const recommendations = ref<SpotifyTrack[]>([])

// Fetch recently played tracks
const fetchRecentlyPlayed = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    recentlyPlayed.value = data.items
  } catch (error) {
    console.error('Error fetching recently played:', error)
  }
}

// Fetch recommendations
const fetchRecommendations = async () => {
  try {
    // Get user's top tracks to seed recommendations
    const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const topTracksData = await topTracksResponse.json()
    
    // Get seed tracks for recommendations
    const seedTracks = topTracksData.items.map((track: SpotifyTrack) => track.id).join(',')
    
    // Fetch recommendations based on seed tracks
    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=10&seed_tracks=${seedTracks}`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    recommendations.value = data.tracks
  } catch (error) {
    console.error('Error fetching recommendations:', error)
  }
}

// Fetch data when component is mounted
onMounted(() => {
  if (isAuthenticated()) {
    fetchRecentlyPlayed()
    fetchRecommendations()
  }
})
</script> 