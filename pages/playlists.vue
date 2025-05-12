<template>
  <div class="bg-[#121212] min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Your Playlists</h1>
        <button 
          @click="showCreateModal = true"
          class="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200"
        >
          Create Playlist
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-500 p-8">
        {{ error }}
      </div>

      <!-- Playlists Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div 
          v-for="playlist in playlists" 
          :key="playlist.id"
          class="bg-[#181818] p-4 rounded-md hover:bg-[#282828] cursor-pointer"
          @click="navigateToPlaylist(playlist.id)"
        >
          <img 
            :src="playlist.images?.[0]?.url" 
            :alt="playlist.name"
            class="w-full aspect-square rounded-md mb-4 shadow-lg"
          />
          <h3 class="font-medium truncate">{{ playlist.name }}</h3>
          <p class="text-sm text-gray-400">{{ playlist.tracks?.total || 0 }} songs</p>
        </div>
      </div>

      <!-- Create Playlist Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div class="bg-[#282828] p-6 rounded-lg w-full max-w-md">
          <h2 class="text-2xl font-bold mb-4">Create Playlist</h2>
          <form @submit.prevent="createPlaylist">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Name</label>
              <input 
                v-model="newPlaylistName"
                type="text"
                class="w-full bg-[#3E3E3E] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="My Playlist"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Description</label>
              <textarea 
                v-model="newPlaylistDescription"
                class="w-full bg-[#3E3E3E] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Add an optional description"
                rows="3"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-4">
              <button 
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200"
                :disabled="isCreating"
              >
                {{ isCreating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import type { SpotifyPlaylist } from '~/types/spotify'

const { accessToken, refreshAccessToken } = useAuth()
const playlists = ref<SpotifyPlaylist[]>([])
const showCreateModal = ref(false)
const newPlaylistName = ref('')
const newPlaylistDescription = ref('')
const isCreating = ref(false)
const isLoading = ref(true)
const error = ref<string>('')

const fetchPlaylists = async () => {
  if (!accessToken.value) return

  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
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

const createPlaylist = async () => {
  if (!accessToken.value) {
    console.error('Access token is not available.')
    navigateTo('/')
    return
  }

  isCreating.value = true
  try {
    // First, get the user's ID
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!userResponse.ok) {
      if (userResponse.status === 401) {
        await refreshAccessToken()
        return createPlaylist()
      }
      throw new Error('Failed to get user info')
    }

    const userData = await userResponse.json()
    const userId = userData.id

    // Create the playlist
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newPlaylistName.value,
        description: newPlaylistDescription.value,
        public: false
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create playlist')
    }

    const newPlaylist = await response.json()
    playlists.value.unshift(newPlaylist)
    showCreateModal.value = false
    newPlaylistName.value = ''
    newPlaylistDescription.value = ''
  } catch (error) {
    console.error('Error creating playlist:', error)
  } finally {
    isCreating.value = false
  }
}

const navigateToPlaylist = (id: string) => {
  navigateTo(`/playlist/${id}`)
}

onMounted(() => {
  fetchPlaylists()
})
</script>