<template>
  <div>
    <!-- Playlist Header -->
    <div v-if="playlist" class="flex items-end space-x-6 mb-8">
      <div class="w-48 h-48 relative">
        <img 
          v-if="playlist.images?.[0]?.url" 
          :src="playlist.images[0].url" 
          :alt="playlist.name"
          class="w-full h-full object-cover rounded-lg shadow-2xl"
        />
        <div v-else class="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
          <button 
            @click="playPlaylist"
            class="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-200 bg-green-500 text-white p-4 rounded-full"
          >
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="flex-1">
        <h1 class="text-4xl font-bold mb-2">{{ playlist.name }}</h1>
        <p class="text-gray-400">{{ playlist.description }}</p>
        <p class="text-gray-400 mt-2">{{ playlist.tracks?.total || 0 }} tracks</p>
        <div class="flex space-x-4 mt-4">
          <button 
            @click="playPlaylist"
            class="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Play</span>
          </button>
          <button 
            @click="showAddTracksModal = true"
            class="bg-gray-700 text-white px-8 py-3 rounded-full hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Add Tracks</span>
          </button>
          <button 
            @click="showEditModal = true"
            class="bg-gray-700 text-white px-8 py-3 rounded-full hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            <span>Edit Playlist</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <!-- Tracks List -->
    <div v-else-if="tracks.length > 0" class="space-y-2">
      <div v-for="(track, index) in tracks" :key="track.id"
           class="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group">
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
            <span class="mx-2">•</span>
            <a 
              @click.stop="navigateToAlbum(track.album.id)"
              class="hover:text-white cursor-pointer transition-colors underline hover:no-underline"
            >
              {{ track.album.name }}
            </a>
          </p>
        </div>
        <div class="text-gray-400 text-sm">
          {{ formatDuration(track.duration_ms) }}
        </div>
        <button 
          @click="removeTrack(track.uri)"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-400 py-12">
      <p class="mb-4">No tracks in this playlist</p>
      <button 
        @click="showAddTracksModal = true"
        class="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
      >
        Add Tracks
      </button>
    </div>

    <!-- Add Tracks Button -->
    <div class="fixed bottom-8 right-8">
      <button 
        @click="showAddTracksModal = true"
        class="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-colors shadow-lg"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>
    </div>

    <!-- Add Tracks Modal -->
    <div v-if="showAddTracksModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Add Tracks</h2>
          <button 
            @click="closeAddTracksModal"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <!-- Search Input -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for tracks..."
            class="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 mb-4 pr-10"
            @input="handleSearch"
          />
          <div v-if="isSearching" class="absolute right-3 top-3">
            <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
          <div v-for="track in searchResults" :key="track.id"
               class="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
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
            </div>
            <div class="flex-1">
              <h3 class="font-medium truncate">{{ track.name }}</h3>
              <p class="text-sm text-gray-400 truncate">{{ track.artists.map(artist => artist.name).join(', ') }}</p>
            </div>
            <div class="text-gray-400 text-sm">
              {{ formatDuration(track.duration_ms) }}
            </div>
            <button 
              @click="addTrack(track.uri)"
              class="text-green-500 hover:text-green-400 transition-colors"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="searchQuery" class="text-center text-gray-400 py-8">
          No tracks found
        </div>

        <!-- Initial State -->
        <div v-else class="text-center text-gray-400 py-8">
          Search for tracks to add to your playlist
        </div>
      </div>
    </div>

    <!-- Add Edit Playlist Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Edit Playlist</h2>
          <button 
            @click="closeEditModal"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="updatePlaylist" class="space-y-4">
          <!-- Playlist Name -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Playlist Name</label>
            <input
              v-model="editForm.name"
              type="text"
              class="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400"
              placeholder="Enter playlist name"
            />
          </div>

          <!-- Playlist Description -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              v-model="editForm.description"
              class="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400"
              placeholder="Enter playlist description"
              rows="3"
            ></textarea>
          </div>

          <!-- Playlist Image -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Cover Image URL</label>
            <input
              v-model="editForm.imageUrl"
              type="text"
              class="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400"
              placeholder="Enter image URL"
            />
            <div v-if="editForm.imageUrl" class="mt-2">
              <img 
                :src="editForm.imageUrl" 
                alt="Playlist cover preview" 
                class="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-700 my-4"></div>

          <!-- Delete Playlist Section -->
          <div class="bg-red-900/20 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
            <p class="text-sm text-gray-400 mb-4">Once you delete a playlist, there is no going back. Please be certain.</p>
            <button
              type="button"
              @click="deletePlaylist"
              class="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              <span>Delete Playlist</span>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-row gap-2.5">
            <button
              type="button"
              @click="closeEditModal"
              class="bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2"
              :disabled="isLoading"
            >
              <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSpotifyPlayback } from '~/composables/useSpotifyPlayback'

interface Track {
  id: string
  name: string
  uri: string
  duration_ms: number
  artists: Array<{ id: string; name: string }>
  album: {
    images: Array<{ url: string }>
    id: string
    name: string
  }
}

interface Playlist {
  id: string
  name: string
  description: string
  images: Array<{ url: string }>
  tracks: {
    total: number
  }
}

const route = useRoute()
const { accessToken, refreshAccessToken } = useAuth()
const { playTrack } = useSpotifyPlayback()

const playlist = ref<Playlist | null>(null)
const tracks = ref<Track[]>([])
const isLoading = ref(true)
const showAddTracksModal = ref(false)
const searchQuery = ref('')
const searchResults = ref<Track[]>([])
const isSearching = ref(false)
let searchTimeout: NodeJS.Timeout | null = null
const showEditModal = ref(false)
const editForm = ref({
  name: '',
  description: '',
  imageUrl: ''
})

// Format duration from milliseconds to MM:SS
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Fetch playlist details
const fetchPlaylist = async () => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    playlist.value = data
    tracks.value = data.tracks.items.map((item: any) => item.track)
  } catch (error) {
    console.error('Error fetching playlist:', error)
  } finally {
    isLoading.value = false
  }
}

// Close add tracks modal and reset search
const closeAddTracksModal = () => {
  showAddTracksModal.value = false
  searchQuery.value = ''
  searchResults.value = []
}

// Search tracks
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(async () => {
    if (!searchQuery.value) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery.value)}&type=track&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken.value}`
          }
        }
      )
      if (!response.ok) {
        throw new Error('Search request failed')
      }
      const data = await response.json()
      searchResults.value = data.tracks.items
    } catch (error) {
      console.error('Error searching tracks:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
}

// Play entire playlist
const playPlaylist = async () => {
  if (!tracks.value.length) return
  
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

    // Start playing the playlist
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${activeDevice.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        context_uri: `spotify:playlist:${route.params.id}`
      })
    })
  } catch (error) {
    console.error('Error playing playlist:', error)
  }
}

// Add track to playlist
const addTrack = async (trackUri: string) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${route.params.id}/tracks`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [trackUri]
        })
      }
    )
    
    if (response.ok) {
      await fetchPlaylist() // Refresh playlist
      closeAddTracksModal() // Close modal and reset search
    }
  } catch (error) {
    console.error('Error adding track:', error)
  }
}

// Remove track from playlist
const removeTrack = async (trackUri: string) => {
  if (!confirm('Are you sure you want to remove this track from the playlist?')) return

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${route.params.id}/tracks`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tracks: [{ uri: trackUri }]
        })
      }
    )
    
    if (response.ok) {
      await fetchPlaylist() // Refresh playlist
    }
  } catch (error) {
    console.error('Error removing track:', error)
  }
}

// Delete playlist
const deletePlaylist = async () => {
  if (!confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) return

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${route.params.id}/followers`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      }
    )
    
    if (response.ok) {
      // Navigate back to playlists page after successful deletion
      navigateTo('/playlists')
    } else {
      throw new Error('Failed to delete playlist')
    }
  } catch (error) {
    console.error('Error deleting playlist:', error)
    alert('Failed to delete playlist. Please try again.')
  }
}

// Close edit modal and reset form
const closeEditModal = () => {
  showEditModal.value = false
  // Reset form to current playlist values
  if (playlist.value) {
    editForm.value = {
      name: playlist.value.name,
      description: playlist.value.description || '',
      imageUrl: playlist.value.images?.[0]?.url || ''
    }
  }
}

// Update playlist
const updatePlaylist = async () => {
  try {
    // Show loading state
    isLoading.value = true

    // First check if we have permission to modify this playlist
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!playlistResponse.ok) {
      if (playlistResponse.status === 401) {
        await refreshAccessToken()
        return updatePlaylist()
      }
      throw new Error('Failed to fetch playlist details')
    }

    const playlistData = await playlistResponse.json()
    
    // Check if the current user is the owner
    const meResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    
    if (!meResponse.ok) {
      if (meResponse.status === 401) {
        await refreshAccessToken()
        return updatePlaylist()
      }
      throw new Error('Failed to fetch user details')
    }
    
    const meData = await meResponse.json()
    const isOwner = playlistData.owner.id === meData.id

    if (!isOwner) {
      throw new Error('You do not have permission to modify this playlist')
    }

    // Update playlist details
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${route.params.id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editForm.value.name,
          description: editForm.value.description,
          public: playlistData.public // Maintain current public/private status
        })
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        await refreshAccessToken()
        return updatePlaylist()
      }
      throw new Error('Failed to update playlist')
    }

    // Update playlist image if URL is provided and different from current
    if (editForm.value.imageUrl && editForm.value.imageUrl !== playlist.value?.images?.[0]?.url) {
      try {
        // First, fetch the image to ensure it's valid
        const imageResponse = await fetch(editForm.value.imageUrl)
        if (!imageResponse.ok) {
          throw new Error('Invalid image URL')
        }
        
        // Convert the image to base64
        const blob = await imageResponse.blob()
        const reader = new FileReader()
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
        })
        reader.readAsDataURL(blob)
        const base64Data = await base64Promise
        
        // Remove the data URL prefix to get just the base64 data
        const base64Image = (base64Data as string).split(',')[1]

        // Update the playlist image
        const imageUpdateResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${route.params.id}/images`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken.value}`,
              'Content-Type': 'image/jpeg'
            },
            body: base64Image
          }
        )

        if (!imageUpdateResponse.ok) {
          if (imageUpdateResponse.status === 401) {
            await refreshAccessToken()
            // Retry the image update with the new token
            const retryResponse = await fetch(
              `https://api.spotify.com/v1/playlists/${route.params.id}/images`,
              {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${accessToken.value}`,
                  'Content-Type': 'image/jpeg'
                },
                body: base64Image
              }
            )
            if (!retryResponse.ok) {
              throw new Error('Failed to update playlist image after token refresh')
            }
          } else {
            const errorText = await imageUpdateResponse.text()
            throw new Error(`Failed to update playlist image: ${errorText}`)
          }
        }
      } catch (imageError) {
        console.error('Error updating playlist image:', imageError)
        throw new Error(`Failed to update playlist image: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`)
      }
    }

    // Refresh playlist data
    await fetchPlaylist()
    closeEditModal()
    
    // Show success message
    alert('Playlist updated successfully!')
  } catch (error) {
    console.error('Error updating playlist:', error)
    alert(error instanceof Error ? error.message : 'Failed to update playlist. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Navigation functions
const navigateToArtist = (artistId: string) => {
  navigateTo(`/artist/${artistId}`)
}

const navigateToAlbum = (albumId: string) => {
  navigateTo(`/album/${albumId}`)
}

onMounted(async () => {
  await fetchPlaylist()
  if (playlist.value) {
    editForm.value = {
      name: playlist.value.name,
      description: playlist.value.description || '',
      imageUrl: playlist.value.images?.[0]?.url || ''
    }
  }
})
</script>