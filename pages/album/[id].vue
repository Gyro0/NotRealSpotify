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

    <!-- Album Details -->
    <div v-else-if="album" class="space-y-8">
      <!-- Album Header -->
      <div class="flex items-end space-x-6">
        <div class="w-48 h-48 relative group">
          <img 
            v-if="album.images?.[0]?.url" 
            :src="album.images[0].url" 
            :alt="album.name"
            class="w-full h-full object-cover rounded-lg shadow-2xl"
          />
          <div v-else class="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center">
            <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
            <button 
              @click="playAlbum"
              class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-200 bg-green-500 text-white p-4 rounded-full"
            >
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex-1">
          <h1 class="text-4xl font-bold mb-2">{{ album.name }}</h1>
          <div class="flex items-center space-x-2 text-gray-400">
            <span v-for="(artist, index) in album.artists" :key="artist.id">
              <a 
                @click="navigateToArtist(artist.id)"
                class="hover:text-white cursor-pointer transition-colors underline hover:no-underline"
              >
                {{ artist.name }}
              </a>
              <span v-if="index < album.artists.length - 1">, </span>
            </span>
            <span class="mx-2">•</span>
            <span>{{ album.release_date.split('-')[0] }}</span>
            <span class="mx-2">•</span>
            <span>{{ album.total_tracks }} songs</span>
          </div>
          <div class="mt-4 flex items-center space-x-4">
            <button 
              @click="playAlbum"
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

      <!-- Tracks List -->
      <div class="space-y-2">
        <div v-for="(track, index) in album.tracks.items" :key="track.id"
             class="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group">
          <div class="w-12 h-12 relative">
            <img 
              v-if="album.images?.[0]?.url" 
              :src="album.images[0].url" 
              :alt="track.name"
              class="w-full h-full object-cover rounded"
            />
            <div v-else class="w-full h-full bg-gray-600 rounded flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded flex items-center justify-center">
              <button 
                @click="playTrack(track.uri)"
                class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-200 bg-green-500 text-white p-2 rounded-full"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-medium truncate">{{ track.name }}</h3>
            <p class="text-sm text-gray-400 truncate">
              <span v-for="(artist, index) in track.artists" :key="artist.id">
                <a 
                  @click.stop="navigateToArtist(artist.id)"
                  class="hover:text-white cursor-pointer transition-colors underline hover:no-underline"
                >
                  {{ artist.name }}
                </a>
                <span v-if="index < track.artists.length - 1">, </span>
              </span>
            </p>
          </div>
          <div class="text-gray-400 text-sm">
            {{ formatDuration(track.duration_ms) }}
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

interface SpotifyTrack {
  id: string
  name: string
  uri: string
  duration_ms: number
  artists: SpotifyArtist[]
}

interface Album {
  id: string
  name: string
  images: SpotifyImage[]
  artists: SpotifyArtist[]
  release_date: string
  total_tracks: number
  tracks: {
    items: SpotifyTrack[]
  }
}

const route = useRoute()
const router = useRouter()
const { accessToken, refreshAccessToken } = useAuth()
const { playTrack } = useSpotifyPlayback()

const album = ref<Album | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Format duration from milliseconds to MM:SS
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Navigate to artist page
const navigateToArtist = (artistId: string) => {
  router.push(`/artist/${artistId}`)
}

// Play entire album
const playAlbum = async () => {
  if (!album.value) return
  
  try {
    // First, get the Spotify device ID
    const devicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const devicesData = await devicesResponse.json()
    const activeDevice = devicesData.devices.find((device: any) => device.is_active) || devicesData.devices[0]
    
    if (!activeDevice) {
      console.error('No active device found')
      return
    }

    // Start playing the album
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${activeDevice.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        context_uri: `spotify:album:${album.value.id}`
      })
    })
  } catch (error) {
    console.error('Error playing album:', error)
  }
}

// Fetch album details
const fetchAlbum = async () => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${route.params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return fetchAlbum()
      }
      throw new Error('Failed to fetch album details')
    }

    const data = await response.json()
    album.value = data
  } catch (err: unknown) {
    console.error('Error fetching album:', err)
    error.value = err instanceof Error ? err.message : 'Failed to fetch album details'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchAlbum()
})
</script> 