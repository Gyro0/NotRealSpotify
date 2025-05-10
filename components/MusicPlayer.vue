<template>
  <div class="fixed bottom-0 left-0 right-0 bg-gray-900 p-4">
    <div class="flex items-center justify-between">
      <!-- Track Info -->
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 bg-gray-800 rounded">
          <img
            v-if="currentTrack?.album?.images[0]?.url"
            :src="currentTrack.album.images[0].url"
            :alt="currentTrack.name"
            class="w-full h-full object-cover rounded"
          />
        </div>
        <div>
          <h3 class="text-sm font-medium">{{ currentTrack?.name || 'No track playing' }}</h3>
          <p class="text-xs text-gray-400">{{ currentTrack?.artists?.[0]?.name || 'Unknown artist' }}</p>
        </div>
      </div>

      <!-- Player Controls -->
      <div class="flex flex-col items-center space-y-2">
        <div class="flex items-center space-x-4">
          <button
            @click="previousTrack"
            class="text-white hover:text-green-500 transition-colors"
          >
            <span class="sr-only">Previous</span>
            ⏮
          </button>
          <button
            @click="togglePlay"
            class="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <span class="sr-only">{{ isPlaying ? 'Pause' : 'Play' }}</span>
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <button
            @click="nextTrack"
            class="text-white hover:text-green-500 transition-colors"
          >
            <span class="sr-only">Next</span>
            ⏭
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="flex items-center space-x-2 w-full max-w-md">
          <span class="text-xs text-gray-400">{{ formatTime(currentTime) }}</span>
          <div class="flex-1 h-1 bg-gray-600 rounded-full">
            <div
              class="h-1 bg-white rounded-full"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <span class="text-xs text-gray-400">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-2">
        <button
          @click="toggleMute"
          class="text-white hover:text-green-500 transition-colors"
        >
          <span class="sr-only">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
          {{ isMuted ? '🔇' : '🔊' }}
        </button>
        <div class="w-24 h-1 bg-gray-600 rounded-full">
          <div
            class="h-1 bg-white rounded-full"
            :style="{ width: `${volume * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { accessToken } = useAuth()
const currentTrack = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)

// Format time in seconds to MM:SS
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Calculate progress percentage
const progress = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

// Toggle play/pause
const togglePlay = async () => {
  try {
    if (isPlaying.value) {
      await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
    } else {
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
    }
    isPlaying.value = !isPlaying.value
  } catch (error) {
    console.error('Error toggling playback:', error)
  }
}

// Previous track
const previousTrack = async () => {
  try {
    await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    await updateCurrentTrack()
  } catch (error) {
    console.error('Error playing previous track:', error)
  }
}

// Next track
const nextTrack = async () => {
  try {
    await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    await updateCurrentTrack()
  } catch (error) {
    console.error('Error playing next track:', error)
  }
}

// Toggle mute
const toggleMute = () => {
  isMuted.value = !isMuted.value
  volume.value = isMuted.value ? 0 : 1
}

// Update current track info
const updateCurrentTrack = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    currentTrack.value = data.item
    isPlaying.value = data.is_playing
    currentTime.value = data.progress_ms / 1000
    duration.value = data.item.duration_ms / 1000
  } catch (error) {
    console.error('Error updating current track:', error)
  }
}

// Poll for updates
onMounted(() => {
  if (accessToken.value) {
    updateCurrentTrack()
    setInterval(updateCurrentTrack, 1000)
  }
})
</script> 