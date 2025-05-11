<template>
  <div class="min-h-screen">
    <!-- Search Input -->
    <div class="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for tracks, artists, albums, playlists, or user profiles..."
          class="w-full bg-gray-800 text-white px-4 py-3 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
          @input="handleSearch"
        />
        <svg class="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>

    <!-- Search Results -->
    <div v-else-if="searchQuery" class="p-8">
      <!-- User Profiles -->
      <div v-if="displayedUsers.length > 0" class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">User Profiles</h2>
          <button 
            v-if="users.length > displayedUsers.length"
            @click="loadMoreUsers"
            class="text-green-500 hover:text-green-400 transition-colors"
          >
            Show More
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <div v-for="user in displayedUsers" :key="user.id" 
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            @click="navigateToUser(user.id)"
          >
            <img 
              v-if="user.images?.[0]?.url" 
              :src="user.images[0].url" 
              :alt="user.display_name"
              class="w-full aspect-square object-cover rounded mb-4"
            />
            <div v-else class="w-full aspect-square bg-gray-700 rounded mb-4 flex items-center justify-center">
              <span class="text-2xl text-gray-400">{{ user.display_name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="font-medium truncate">{{ user.display_name }}</h3>
            <p class="text-sm text-gray-400">{{ user.followers?.total }} followers</p>
          </div>
        </div>
      </div>

      <!-- Tracks -->
      <div v-if="displayedTracks.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Tracks</h2>
        <div class="space-y-4">
          <div v-for="track in displayedTracks" :key="track?.id" 
            class="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            @click="playTrack(track?.uri)"
          >
            <img 
              v-if="track?.album?.images?.[0]?.url" 
              :src="track.album.images[0].url" 
              :alt="track?.name"
              class="w-12 h-12 rounded"
            />
            <div class="flex-1">
              <p class="font-medium">{{ track?.name }}</p>
              <p class="text-sm text-gray-400">{{ track?.artists?.map(artist => artist?.name).filter(Boolean).join(', ') }}</p>
            </div>
            <span class="text-gray-400">{{ formatDuration(track?.duration_ms || 0) }}</span>
          </div>
        </div>
        <button 
          v-if="tracks.length > displayedTracks.length"
          @click="loadMoreTracks"
          class="mt-4 text-green-500 hover:text-green-400"
        >
          See More Tracks
        </button>
      </div>

      <!-- Artists -->
      <div v-if="displayedArtists.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Artists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="artist in displayedArtists" :key="artist?.id" 
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            @click="navigateToArtist(artist?.id)"
          >
            <img 
              v-if="artist?.images?.[0]?.url" 
              :src="artist.images[0].url" 
              :alt="artist?.name"
              class="w-full aspect-square object-cover rounded-full mb-4"
            />
            <div v-else class="w-full aspect-square bg-gray-700 rounded-full mb-4 flex items-center justify-center">
              <span class="text-2xl text-gray-400">{{ artist?.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="font-medium truncate text-center">{{ artist?.name }}</h3>
            <p class="text-sm text-gray-400 text-center">Artist</p>
          </div>
        </div>
        <button 
          v-if="artists.length > displayedArtists.length"
          @click="loadMoreArtists"
          class="mt-4 text-green-500 hover:text-green-400"
        >
          See More Artists
        </button>
      </div>

      <!-- Albums -->
      <div v-if="displayedAlbums.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Albums</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="album in displayedAlbums" :key="album?.id" 
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            @click="navigateToAlbum(album?.id)"
          >
            <img 
              v-if="album?.images?.[0]?.url" 
              :src="album.images[0].url" 
              :alt="album?.name"
              class="w-full aspect-square object-cover rounded mb-4"
            />
            <div v-else class="w-full aspect-square bg-gray-700 rounded mb-4 flex items-center justify-center">
              <span class="text-2xl text-gray-400">{{ album?.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="font-medium truncate">{{ album?.name }}</h3>
            <p class="text-sm text-gray-400">{{ album?.artists?.map(artist => artist?.name).filter(Boolean).join(', ') }}</p>
          </div>
        </div>
        <button 
          v-if="albums.length > displayedAlbums.length"
          @click="loadMoreAlbums"
          class="mt-4 text-green-500 hover:text-green-400"
        >
          See More Albums
        </button>
      </div>

      <!-- Playlists -->
      <div v-if="displayedPlaylists.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Playlists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="playlist in displayedPlaylists" :key="playlist?.id" 
            class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            @click="navigateToPlaylist(playlist?.id)"
          >
            <img 
              v-if="playlist?.images?.[0]?.url" 
              :src="playlist.images[0].url" 
              :alt="playlist?.name"
              class="w-full aspect-square object-cover rounded mb-4"
            />
            <div v-else class="w-full aspect-square bg-gray-700 rounded mb-4 flex items-center justify-center">
              <span class="text-2xl text-gray-400">{{ playlist?.name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="font-medium truncate">{{ playlist?.name }}</h3>
            <p class="text-sm text-gray-400">By {{ playlist?.owner?.display_name }}</p>
          </div>
        </div>
        <button 
          v-if="playlists.length > displayedPlaylists.length"
          @click="loadMorePlaylists"
          class="mt-4 text-green-500 hover:text-green-400"
        >
          See More Playlists
        </button>
      </div>

      <!-- No Results -->
      <div v-if="!isLoading && !displayedTracks.length && !displayedArtists.length && !displayedAlbums.length && !displayedPlaylists.length && !displayedUsers.length" 
        class="text-center text-gray-400 py-12"
      >
        No results found for "{{ searchQuery }}"
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useSpotifyPlayback } from '~/composables/useSpotifyPlayback'

interface SpotifyImage {
  url: string
}

interface SpotifyArtist {
  id: string
  name: string
  images: SpotifyImage[]
}

interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  artists: SpotifyArtist[]
}

interface SpotifyTrack {
  id: string
  name: string
  uri: string
  duration_ms: number
  album: SpotifyAlbum
  artists: SpotifyArtist[]
}

interface SpotifyPlaylist {
  id: string
  name: string
  images: SpotifyImage[]
  owner: {
    display_name: string
  }
}

interface SpotifyUser {
  id: string
  display_name: string
  images: SpotifyImage[]
  followers?: {
    total: number
  }
}

const router = useRouter()
const { accessToken, refreshAccessToken } = useAuth()
const { playTrack: playSpotifyTrack } = useSpotifyPlayback()

const searchQuery = ref('')
const isLoading = ref(false)
const tracks = ref<SpotifyTrack[]>([])
const artists = ref<SpotifyArtist[]>([])
const albums = ref<SpotifyAlbum[]>([])
const playlists = ref<SpotifyPlaylist[]>([])
const users = ref<SpotifyUser[]>([])

// Display limits
const ITEMS_PER_PAGE = 6
const displayedTracks = ref<SpotifyTrack[]>([])
const displayedArtists = ref<SpotifyArtist[]>([])
const displayedAlbums = ref<SpotifyAlbum[]>([])
const displayedPlaylists = ref<SpotifyPlaylist[]>([])
const displayedUsers = ref<SpotifyUser[]>([])
const usersPerPage = 6
const error = ref('')

// Custom debounce function
let searchTimeout: NodeJS.Timeout | null = null
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    search()
  }, 300)
}

// Load more functions
const loadMoreTracks = () => {
  const currentLength = displayedTracks.value.length
  displayedTracks.value = tracks.value.slice(0, currentLength + ITEMS_PER_PAGE)
}

const loadMoreArtists = () => {
  const currentLength = displayedArtists.value.length
  displayedArtists.value = artists.value.slice(0, currentLength + ITEMS_PER_PAGE)
}

const loadMoreAlbums = () => {
  const currentLength = displayedAlbums.value.length
  displayedAlbums.value = albums.value.slice(0, currentLength + ITEMS_PER_PAGE)
}

const loadMorePlaylists = () => {
  const currentLength = displayedPlaylists.value.length
  displayedPlaylists.value = playlists.value.slice(0, currentLength + ITEMS_PER_PAGE)
}

const loadMoreUsers = () => {
  const currentLength = displayedUsers.value.length
  const nextUsers = users.value.slice(currentLength, currentLength + usersPerPage)
  displayedUsers.value = [...displayedUsers.value, ...nextUsers]
}

// Format duration from milliseconds to MM:SS
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Search function
const search = async () => {
  if (!searchQuery.value) {
    resetResults()
    return
  }

  if (!accessToken.value) {
    console.error('No access token available')
    return
  }

  isLoading.value = true
  try {
    // Search for tracks, artists, albums, and playlists
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery.value)}&type=track,artist,album,playlist&limit=50`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return search()
      }
      throw new Error('Failed to search')
    }
    
    const data = await response.json()
    tracks.value = data.tracks?.items || []
    artists.value = data.artists?.items || []
    albums.value = data.albums?.items || []
    playlists.value = data.playlists?.items || []

    // Search for users by trying to fetch their profile
    try {
      const userResponse = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(searchQuery.value)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        users.value = [userData]
      } else {
        users.value = []
      }
    } catch (error) {
      console.error('Error searching for users:', error)
      users.value = []
    }
    
    // Initialize displayed items
    resetDisplayedItems()
  } catch (error) {
    console.error('Error searching:', error)
  } finally {
    isLoading.value = false
  }
}

// Reset displayed items to initial state
const resetDisplayedItems = () => {
  displayedTracks.value = tracks.value.slice(0, ITEMS_PER_PAGE)
  displayedArtists.value = artists.value.slice(0, ITEMS_PER_PAGE)
  displayedAlbums.value = albums.value.slice(0, ITEMS_PER_PAGE)
  displayedPlaylists.value = playlists.value.slice(0, ITEMS_PER_PAGE)
  displayedUsers.value = users.value.slice(0, usersPerPage)
}

// Reset all results
const resetResults = () => {
  tracks.value = []
  artists.value = []
  albums.value = []
  playlists.value = []
  users.value = []
  displayedUsers.value = []
  displayedTracks.value = []
  displayedArtists.value = []
  displayedAlbums.value = []
  displayedPlaylists.value = []
  isLoading.value = false
  error.value = ''
}

// Navigation functions
const navigateToUser = (id: string) => {
  if (id) {
    router.push(`/user/${id}`)
  }
}

const navigateToArtist = (id: string) => {
  if (id) {
    router.push(`/artist/${id}`)
  }
}

const navigateToAlbum = (id: string) => {
  if (id) {
    router.push(`/album/${id}`)
  }
}

const navigateToPlaylist = (id: string) => {
  if (id) {
    router.push(`/playlist/${id}`)
  }
}

// Play track
const playTrack = (uri: string) => {
  if (uri) {
    playSpotifyTrack(uri)
  }
}

onMounted(() => {
  // Clear any existing search results
  resetResults()
})
</script> 