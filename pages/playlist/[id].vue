<template>
  <div>
    <!-- Playlist Header -->
    <div class="flex items-end space-x-6 mb-8">
      <img 
        v-if="playlist?.images?.length > 0" 
        :src="playlist.images[0].url" 
        :alt="playlist.name"
        class="w-48 h-48 rounded-lg shadow-lg"
      />
      <div v-else class="w-48 h-48 bg-gray-600 rounded-lg"></div>
      <div>
        <h1 class="text-4xl font-bold mb-2">{{ playlist?.name }}</h1>
        <p class="text-gray-400">{{ playlist?.tracks?.total }} tracks</p>
      </div>
    </div>

    <!-- Tracks List -->
    <div class="space-y-2">
      <div v-for="(item, index) in tracks" :key="item.track.id" 
           class="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
           @click="playTrack(item.track)">
        <span class="text-gray-400 w-8">{{ index + 1 }}</span>
        <img 
          v-if="item.track.album?.images?.length > 0" 
          :src="item.track.album.images[0].url" 
          :alt="item.track.name"
          class="w-12 h-12 rounded"
        />
        <div v-else class="w-12 h-12 bg-gray-600 rounded"></div>
        <div class="flex-1">
          <h3 class="font-medium">{{ item.track.name }}</h3>
          <p class="text-sm text-gray-400">{{ item.track.artists.map(artist => artist.name).join(', ') }}</p>
        </div>
        <div class="text-gray-400 text-sm">{{ formatDuration(item.track.duration_ms) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const { accessToken } = useAuth()
const { getPlaylist, playTrack } = useSpotifyApi()
const playlist = ref(null)
const tracks = ref([])

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const fetchPlaylist = async () => {
  try {
    const data = await getPlaylist(route.params.id as string)
    playlist.value = data
    tracks.value = data.tracks.items
  } catch (error) {
    console.error('Error fetching playlist:', error)
  }
}

onMounted(() => {
  if (accessToken.value) {
    fetchPlaylist()
  }
})
</script> 