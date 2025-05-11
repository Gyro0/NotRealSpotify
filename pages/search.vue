<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Search</h1>
    
    <!-- Search Input -->
    <div class="mb-8">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for artists, songs, or albums..."
        class="w-full p-4 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        @input="handleSearch"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <!-- Search Results -->
    <div v-else-if="searchQuery && hasResults">
      <!-- Artists -->
      <section v-if="searchResults.artists?.items.length" class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Artists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="artist in searchResults.artists.items" :key="artist.id"
               class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
               @click="navigateToArtist(artist.id)">
            <div class="aspect-square relative mb-4">
              <img 
                v-if="artist.images?.[0]?.url" 
                :src="artist.images[0].url" 
                :alt="artist.name"
                class="w-full h-full object-cover rounded-full"
              />
              <div v-else class="w-full h-full bg-gray-600 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-full flex items-center justify-center">
                <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-200 bg-green-500 text-white p-3 rounded-full">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <h3 class="font-medium truncate">{{ artist.name }}</h3>
            <p class="text-sm text-gray-400">Artist</p>
          </div>
        </div>
      </section>

      <!-- Albums -->
      <section v-if="searchResults.albums?.items.length" class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Albums</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="album in searchResults.albums.items" :key="album.id"
               class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
               @click="navigateToAlbum(album.id)">
            <div class="aspect-square relative mb-4">
              <img 
                v-if="album.images?.[0]?.url" 
                :src="album.images[0].url" 
                :alt="album.name"
                class="w-full h-full object-cover rounded-lg"
              />
              <div v-else class="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
                <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-200 bg-green-500 text-white p-3 rounded-full">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <h3 class="font-medium truncate">{{ album.name }}</h3>
            <p class="text-sm text-gray-400 truncate">{{ album.artists[0].name }}</p>
          </div>
        </div>
      </section>

      <!-- Playlists -->
      <section v-if="searchResults.playlists?.items.length" class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Playlists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="playlist in searchResults.playlists.items" :key="playlist.id"
               class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
               @click="navigateToPlaylist(playlist.id)">
            <div class="aspect-square relative mb-4">
              <img 
                v-if="playlist.images?.[0]?.url" 
                :src="playlist.images[0].url" 
                :alt="playlist.name"
                class="w-full h-full object-cover rounded-lg"
              />
              <div v-else class="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
                <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-200 bg-green-500 text-white p-3 rounded-full">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <h3 class="font-medium truncate">{{ playlist.name }}</h3>
            <p class="text-sm text-gray-400">By {{ playlist.owner.display_name }}</p>
          </div>
        </div>
      </section>

      <!-- Tracks -->
      <section v-if="searchResults.tracks?.items.length">
        <h2 class="text-2xl font-semibold mb-4">Songs</h2>
        <div class="space-y-2">
          <div v-for="track in searchResults.tracks.items" :key="track.id"
               class="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
               @click="playTrack(track.uri)">
            <div class="w-12 h-12 relative">
              <img 
                v-if="track.album?.images?.[0]?.url" 
                :src="track.album.images[0].url" 
                :alt="track.name"
                class="w-full h-full object-cover rounded"
              />
              <div v-else class="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded flex items-center justify-center">
                <button class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-200 bg-green-500 text-white p-2 rounded-full">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="font-medium truncate">{{ track.name }}</h3>
              <p class="text-sm text-gray-400 truncate">{{ track.artists.map(artist => artist.name).join(', ') }}</p>
            </div>
            <div class="text-gray-400 text-sm">
              {{ formatDuration(track.duration_ms) }}
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- No Results -->
    <div v-else-if="searchQuery && !isLoading" class="text-center text-gray-400 py-12">
      No results found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

interface SpotifyArtist {
  id: string
  name: string
  images: Array<{ url: string }>
}

interface SpotifyAlbum {
  id: string
  name: string
  images: Array<{ url: string }>
  artists: SpotifyArtist[]
}

interface SpotifyTrack {
  id: string
  name: string
  uri: string
  duration_ms: number
  artists: SpotifyArtist[]
  album: SpotifyAlbum
}

interface SpotifyPlaylist {
  id: string
  name: string
  images: Array<{ url: string }>
  owner: {
    display_name: string
  }
}

interface SearchResults {
  artists?: {
    items: SpotifyArtist[]
  }
  albums?: {
    items: SpotifyAlbum[]
  }
  tracks?: {
    items: SpotifyTrack[]
  }
  playlists?: {
    items: SpotifyPlaylist[]
  }
}

const { accessToken } = useAuth()
const { playTrack } = useSpotifyPlayback()
const searchQuery = ref('')
const searchResults = ref<SearchResults>({})
const isLoading = ref(false)

const hasResults = computed(() => {
  return (
    (searchResults.value.artists?.items.length ?? 0) > 0 ||
    (searchResults.value.albums?.items.length ?? 0) > 0 ||
    (searchResults.value.tracks?.items.length ?? 0) > 0 ||
    (searchResults.value.playlists?.items.length ?? 0) > 0
  )
})

// Format duration from milliseconds to MM:SS
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Debounced search function
const debouncedSearch = useDebounceFn(async (query: string) => {
  if (!query) {
    searchResults.value = {}
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist,album,track,playlist&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      }
    )
    const data = await response.json()
    searchResults.value = data
  } catch (error) {
    console.error('Error searching:', error)
  } finally {
    isLoading.value = false
  }
}, 300)

const handleSearch = () => {
  debouncedSearch(searchQuery.value)
}

// Navigation functions
const navigateToArtist = (id: string) => {
  navigateTo(`/artist/${id}`)
}

const navigateToAlbum = (id: string) => {
  navigateTo(`/album/${id}`)
}

const navigateToPlaylist = (id: string) => {
  navigateTo(`/playlist/${id}`)
}
</script> 