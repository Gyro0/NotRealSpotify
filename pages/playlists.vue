<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Your Playlists</h1>
      <button
        @click="createNewPlaylist"
        class="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
      >
        Create Playlist
      </button>
    </div>

    <!-- Playlists Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="playlist in playlists" :key="playlist.id"
           class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
           @click="openPlaylist(playlist)">
        <div class="aspect-square bg-gray-600 rounded-lg mb-4"></div>
        <h3 class="font-medium">{{ playlist.name }}</h3>
        <p class="text-sm text-gray-400">{{ playlist.tracks.total }} tracks</p>
      </div>
    </div>

    <!-- Create Playlist Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">Create New Playlist</h2>
        <input
          v-model="newPlaylistName"
          type="text"
          placeholder="Playlist name"
          class="w-full p-3 bg-gray-700 rounded mb-4 text-white"
        />
        <div class="flex justify-end space-x-4">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            @click="submitNewPlaylist"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { accessToken } = useAuth()
const playlists = ref([])
const showCreateModal = ref(false)
const newPlaylistName = ref('')

// Fetch user's playlists
const fetchPlaylists = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    playlists.value = data.items
  } catch (error) {
    console.error('Error fetching playlists:', error)
  }
}

// Create new playlist
const createNewPlaylist = () => {
  showCreateModal.value = true
}

const submitNewPlaylist = async () => {
  if (!newPlaylistName.value) return

  try {
    // First, get user ID
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const userData = await userResponse.json()

    // Create playlist
    const response = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newPlaylistName.value,
        public: false
      })
    })

    const data = await response.json()
    playlists.value.unshift(data)
    showCreateModal.value = false
    newPlaylistName.value = ''
  } catch (error) {
    console.error('Error creating playlist:', error)
  }
}

// Open playlist
const openPlaylist = (playlist) => {
  navigateTo(`/playlist/${playlist.id}`)
}

// Fetch playlists when component is mounted
onMounted(() => {
  if (accessToken.value) {
    fetchPlaylists()
  }
})
</script> 