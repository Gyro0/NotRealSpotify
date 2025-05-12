<template>
  <div class="bg-[#121212] min-h-screen">
    <!-- Search Input -->
    <div class="sticky top-0 z-10 bg-[#121212] p-4">
      <div class="max-w-3xl mx-auto">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="What do you want to listen to?"
            class="w-full bg-[#242424] text-white px-4 py-3 rounded-md pl-12 focus:outline-none focus:ring-2 focus:ring-white"
            @input="handleSearch"
          />
          <svg class="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>

    <!-- Search Results -->
    <div v-else-if="searchQuery" class="max-w-7xl mx-auto p-4">
      <!-- User Profiles -->
      <div v-if="userProfiles.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Profiles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="profile in userProfiles" :key="profile.id" class="bg-[#181818] p-4 rounded-md hover:bg-[#282828]">
            <div class="flex items-center space-x-4">
              <img :src="profile.images?.[0]?.url || '/default-avatar.png'" :alt="profile.display_name" class="w-16 h-16 rounded-full">
              <div>
                <h3 class="font-medium">{{ profile.display_name }}</h3>
                <p class="text-sm text-gray-400">Profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tracks -->
      <div v-if="tracks.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Songs</h2>
        <div class="space-y-2">
          <div 
            v-for="track in paginatedTracks" 
            :key="track?.id || Math.random()" 
            class="flex items-center justify-between p-2 rounded-md hover:bg-[#282828] cursor-pointer"
            @click="track?.id && navigateToTrack(track.id)"
          >
            <div class="flex items-center space-x-4">
              <img 
                :src="track?.album?.images?.[0]?.url" 
                :alt="track?.name || 'Unknown Track'" 
                class="w-12 h-12"
              >
              <div>
                <h3 class="font-medium">{{ track?.name || 'Unknown Track' }}</h3>
                <p class="text-sm text-gray-400">
                  <template v-if="track?.artists?.length">
                    <span 
                      v-for="(artist, index) in track.artists" 
                      :key="artist?.id || index"
                      class="hover:underline cursor-pointer"
                      @click.stop="artist?.id && navigateToArtist(artist.id)"
                    >
                      {{ artist?.name || 'Unknown Artist' }}{{ index < track.artists.length - 1 ? ', ' : '' }}
                    </span>
                  </template>
                  <span v-else>Unknown Artist</span>
                </p>
              </div>
            </div>
            <div class="text-sm text-gray-400">{{ track?.duration_ms ? formatDuration(track.duration_ms) : '0:00' }}</div>
          </div>
        </div>
        <!-- Show More Tracks Button -->
        <div v-if="tracks.length > tracksLimit" class="mt-4 text-center">
          <button 
            @click="showMoreTracks"
            class="text-gray-400 hover:text-white px-4 py-2 rounded-full border border-gray-400 hover:border-white transition-colors"
          >
            Show More Songs
          </button>
        </div>
      </div>

      <!-- Artists -->
      <div v-if="artists.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Artists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div 
            v-for="artist in paginatedArtists" 
            :key="artist?.id || Math.random()" 
            class="bg-[#181818] p-4 rounded-md hover:bg-[#282828] cursor-pointer"
            @click="artist?.id && navigateToArtist(artist.id)"
          >
            <img 
              :src="artist?.images?.[0]?.url" 
              :alt="artist?.name || 'Unknown Artist'" 
              class="w-full aspect-square rounded-full mb-4"
            >
            <h3 class="font-medium truncate">{{ artist?.name || 'Unknown Artist' }}</h3>
            <p class="text-sm text-gray-400">Artist</p>
          </div>
        </div>
        <!-- Show More Artists Button -->
        <div v-if="artists.length > artistsLimit" class="mt-4 text-center">
          <button 
            @click="showMoreArtists"
            class="text-gray-400 hover:text-white px-4 py-2 rounded-full border border-gray-400 hover:border-white transition-colors"
          >
            Show More Artists
          </button>
        </div>
      </div>

      <!-- Albums -->
      <div v-if="albums.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Albums</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div 
            v-for="album in paginatedAlbums" 
            :key="album?.id || Math.random()" 
            class="bg-[#181818] p-4 rounded-md hover:bg-[#282828] cursor-pointer"
          >
            <img 
              :src="album?.images?.[0]?.url" 
              :alt="album?.name || 'Unknown Album'" 
              class="w-full aspect-square rounded-md mb-4"
            >
            <h3 class="font-medium truncate">{{ album?.name || 'Unknown Album' }}</h3>
            <p class="text-sm text-gray-400">{{ album?.artists?.map((a: SpotifyArtist) => a.name).join(', ') || 'Unknown Artist' }}</p>
          </div>
        </div>
        <!-- Show More Albums Button -->
        <div v-if="albums.length > albumsLimit" class="mt-4 text-center">
          <button 
            @click="showMoreAlbums"
            class="text-gray-400 hover:text-white px-4 py-2 rounded-full border border-gray-400 hover:border-white transition-colors"
          >
            Show More Albums
          </button>
        </div>
      </div>

      <!-- Playlists -->
      <div v-if="playlists.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Playlists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div 
            v-for="playlist in paginatedPlaylists" 
            :key="playlist?.id || Math.random()" 
            class="bg-[#181818] p-4 rounded-md hover:bg-[#282828] cursor-pointer"
          >
            <img 
              :src="playlist?.images?.[0]?.url" 
              :alt="playlist?.name || 'Unknown Playlist'" 
              class="w-full aspect-square rounded-md mb-4"
            >
            <h3 class="font-medium truncate">{{ playlist?.name || 'Unknown Playlist' }}</h3>
            <p class="text-sm text-gray-400">By {{ playlist?.owner?.display_name || 'Unknown User' }}</p>
          </div>
        </div>
        <!-- Show More Playlists Button -->
        <div v-if="playlists.length > playlistsLimit" class="mt-4 text-center">
          <button 
            @click="showMorePlaylists"
            class="text-gray-400 hover:text-white px-4 py-2 rounded-full border border-gray-400 hover:border-white transition-colors"
          >
            Show More Playlists
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="!loading && !hasResults" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <h3 class="text-xl font-bold mb-2">No results found</h3>
        <p class="text-gray-400">Try different keywords or check your spelling</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="max-w-3xl mx-auto p-8 text-center">
      <h2 class="text-2xl font-bold mb-4">Search for your favorite music</h2>
      <p class="text-gray-400">Find songs, artists, albums, and playlists</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSpotifySearch } from '~/composables/useSpotifySearch'

interface SpotifyArtist {
  name: string
  id: string
}

interface SpotifyTrack {
  id: string
  name: string
  duration_ms: number
  album?: {
    images?: Array<{ url: string }>
  }
  artists?: Array<SpotifyArtist>
}

const searchQuery = ref('')
const loading = ref(false)
const searchResults = ref<any>(null)

// Pagination state
const tracksLimit = ref(6)
const artistsLimit = ref(6)
const albumsLimit = ref(6)
const playlistsLimit = ref(6)

const { search } = useSpotifySearch()

// Filter out null or invalid items from search results
const userProfiles = computed(() => (searchResults.value?.users?.items || []).filter(Boolean))
const tracks = computed(() => (searchResults.value?.tracks?.items || []).filter((track: SpotifyTrack) => track?.id))
const artists = computed(() => (searchResults.value?.artists?.items || []).filter((artist: SpotifyArtist) => artist?.id))
const albums = computed(() => (searchResults.value?.albums?.items || []).filter(Boolean))
const playlists = computed(() => (searchResults.value?.playlists?.items || []).filter(Boolean))

// Paginated results
const paginatedTracks = computed(() => tracks.value.slice(0, tracksLimit.value))
const paginatedArtists = computed(() => artists.value.slice(0, artistsLimit.value))
const paginatedAlbums = computed(() => albums.value.slice(0, albumsLimit.value))
const paginatedPlaylists = computed(() => playlists.value.slice(0, playlistsLimit.value))

// Show more functions
const showMoreTracks = () => tracksLimit.value += 6
const showMoreArtists = () => artistsLimit.value += 6
const showMoreAlbums = () => albumsLimit.value += 6
const showMorePlaylists = () => playlistsLimit.value += 6

const hasResults = computed(() => {
  return userProfiles.value.length > 0 ||
    tracks.value.length > 0 ||
    artists.value.length > 0 ||
    albums.value.length > 0 ||
    playlists.value.length > 0
})

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = null
    return
  }

  loading.value = true
  try {
    const results = await search(searchQuery.value)
    if (results) {
      searchResults.value = results
    } else {
      searchResults.value = {
        users: { items: [] },
        tracks: { items: [] },
        artists: { items: [] },
        albums: { items: [] },
        playlists: { items: [] }
      }
    }
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = {
      users: { items: [] },
      tracks: { items: [] },
      artists: { items: [] },
      albums: { items: [] },
      playlists: { items: [] }
    }
  } finally {
    loading.value = false
  }
}

const navigateToArtist = (id: string) => {
  if (id) {
    navigateTo(`/artist/${id}`)
  }
}

const navigateToTrack = (id: string) => {
  if (id) {
    navigateTo(`/track/${id}`)
  }
}

const formatDuration = (ms: number) => {
  if (!ms) return '0:00'
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script> 