<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Welcome to Spotify Clone</h1>
    
    <!-- Featured Playlists -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Featured Playlists</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="playlist in featuredPlaylists" :key="playlist.id" 
             class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
          <div class="aspect-square bg-gray-600 rounded-lg mb-4"></div>
          <h3 class="font-medium">{{ playlist.name }}</h3>
          <p class="text-sm text-gray-400">{{ playlist.description }}</p>
        </div>
      </div>
    </section>

    <!-- Recently Played -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Recently Played</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="track in recentlyPlayed" :key="track.id" 
             class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
          <div class="aspect-square bg-gray-600 rounded-lg mb-4"></div>
          <h3 class="font-medium">{{ track.name }}</h3>
          <p class="text-sm text-gray-400">{{ track.artist }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { accessToken } = useAuth()
const featuredPlaylists = ref([])
const recentlyPlayed = ref([])

// Fetch featured playlists
const fetchFeaturedPlaylists = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    featuredPlaylists.value = data.playlists.items
  } catch (error) {
    console.error('Error fetching featured playlists:', error)
  }
}

// Fetch recently played tracks
const fetchRecentlyPlayed = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    recentlyPlayed.value = data.items.map(item => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0].name
    }))
  } catch (error) {
    console.error('Error fetching recently played:', error)
  }
}

// Fetch data when component is mounted
onMounted(() => {
  if (accessToken.value) {
    fetchFeaturedPlaylists()
    fetchRecentlyPlayed()
  }
})
</script> 