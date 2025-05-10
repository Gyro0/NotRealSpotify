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

    <!-- Search Results -->
    <div v-if="searchResults.length > 0">
      <!-- Artists -->
      <section v-if="searchResults.artists?.items.length" class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Artists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="artist in searchResults.artists.items" :key="artist.id"
               class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-center">
            <div class="aspect-square bg-gray-600 rounded-full mb-4 mx-auto"></div>
            <h3 class="font-medium">{{ artist.name }}</h3>
            <p class="text-sm text-gray-400">Artist</p>
          </div>
        </div>
      </section>

      <!-- Albums -->
      <section v-if="searchResults.albums?.items.length" class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Albums</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="album in searchResults.albums.items" :key="album.id"
               class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div class="aspect-square bg-gray-600 rounded-lg mb-4"></div>
            <h3 class="font-medium">{{ album.name }}</h3>
            <p class="text-sm text-gray-400">{{ album.artists[0].name }}</p>
          </div>
        </div>
      </section>

      <!-- Tracks -->
      <section v-if="searchResults.tracks?.items.length">
        <h2 class="text-2xl font-semibold mb-4">Songs</h2>
        <div class="space-y-2">
          <div v-for="track in searchResults.tracks.items" :key="track.id"
               class="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div class="w-12 h-12 bg-gray-600 rounded"></div>
            <div class="flex-1">
              <h3 class="font-medium">{{ track.name }}</h3>
              <p class="text-sm text-gray-400">{{ track.artists[0].name }}</p>
            </div>
            <button class="text-white hover:text-green-500">
              Play
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- No Results -->
    <div v-else-if="searchQuery && !isLoading" class="text-center text-gray-400">
      No results found
    </div>
  </div>
</template>

<script setup>
const { accessToken } = useAuth()
const searchQuery = ref('')
const searchResults = ref({})
const isLoading = ref(false)

// Debounce search function
const debouncedSearch = useDebounceFn(async (query) => {
  if (!query) {
    searchResults.value = {}
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist,album,track&limit=10`,
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
</script> 