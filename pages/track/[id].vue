<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <!-- Track Details -->
    <div v-else-if="track" class="space-y-8">
      <!-- Track Header -->
      <div class="flex items-end space-x-6">
        <div class="w-48 h-48 relative">
          <img 
            v-if="track.album?.images?.[0]?.url" 
            :src="track.album.images[0].url" 
            :alt="track.name"
            class="w-full h-full object-cover rounded-lg shadow-2xl"
          />
          <div v-else class="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center">
            <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h1 class="text-4xl font-bold mb-2">{{ track.name }}</h1>
          <div class="flex items-center space-x-2 text-gray-400">
            <span v-for="(artist, index) in track.artists" :key="artist.id">
              <a 
                @click="navigateToArtist(artist.id)"
                class="hover:text-white cursor-pointer transition-colors"
              >
                {{ artist.name }}
              </a>
              <span v-if="index < track.artists.length - 1">, </span>
            </span>
            <span class="mx-2">•</span>
            <a 
              @click="navigateToAlbum(track.album.id)"
              class="hover:text-white cursor-pointer transition-colors"
            >
              {{ track.album.name }}
            </a>
          </div>
          <div class="mt-4 flex items-center space-x-4">
            <button 
              @click="playTrack(track.uri)"
              class="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Play</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Track Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Track Info -->
        <div class="bg-gray-800 p-6 rounded-lg">
          <h2 class="text-2xl font-bold mb-4">Track Information</h2>
          <div class="space-y-4">
            <div>
              <h3 class="text-gray-400 text-sm">Duration</h3>
              <p>{{ formatDuration(track.duration_ms) }}</p>
            </div>
            <div>
              <h3 class="text-gray-400 text-sm">Release Date</h3>
              <p>{{ formatDate(track.album.release_date) }}</p>
            </div>
            <div>
              <h3 class="text-gray-400 text-sm">Popularity</h3>
              <div class="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  class="bg-green-500 h-2.5 rounded-full" 
                  :style="{ width: `${track.popularity}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Album Info -->
        <div class="bg-gray-800 p-6 rounded-lg">
          <h2 class="text-2xl font-bold mb-4">Album Information</h2>
          <div class="space-y-4">
            <div>
              <h3 class="text-gray-400 text-sm">Album Type</h3>
              <p class="capitalize">{{ track.album.album_type }}</p>
            </div>
            <div>
              <h3 class="text-gray-400 text-sm">Total Tracks</h3>
              <p>{{ track.album.total_tracks }}</p>
            </div>
            <div>
              <h3 class="text-gray-400 text-sm">Label</h3>
              <p>{{ track.album.label || 'Unknown' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface SpotifyImage {
  url: string
}

interface SpotifyArtist {
  id: string
  name: string
}

interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  release_date: string
  album_type: string
  total_tracks: number
  label?: string
}

interface Track {
  id: string
  name: string
  uri: string
  duration_ms: number
  popularity: number
  artists: SpotifyArtist[]
  album: SpotifyAlbum
}

const route = useRoute()
const router = useRouter()
const { accessToken, refreshAccessToken } = useAuth()
const { playTrack } = useSpotifyPlayback()

const track = ref<Track | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Format duration from milliseconds to MM:SS
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Format date to readable format
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Navigate to artist page
const navigateToArtist = (artistId: string) => {
  router.push(`/artist/${artistId}`)
}

// Navigate to album page
const navigateToAlbum = (albumId: string) => {
  router.push(`/album/${albumId}`)
}

// Fetch track details
const fetchTrack = async () => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${route.params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchTrack()
      }
      throw new Error('Failed to fetch track details')
    }

    const data = await response.json()
    track.value = data
  } catch (err: unknown) {
    console.error('Error fetching track:', err)
    error.value = err instanceof Error ? err.message : 'Failed to fetch track details'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchTrack()
})
</script> 