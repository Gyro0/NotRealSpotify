<template>
  <div class="fixed bottom-0 left-0 right-0 bg-gray-900 p-4">
    <div class="flex items-center justify-between">
      <!-- Song Info -->
      <div class="flex items-center gap-4 w-1/4">
        <div v-if="currentTrack" class="w-14 h-14 bg-gray-800 rounded overflow-hidden">
          <img :src="currentTrack.albumArt" :alt="currentTrack.name" class="w-full h-full object-cover">
        </div>
        <div v-if="currentTrack">
          <h3 class="text-sm font-medium">{{ currentTrack.name }}</h3>
          <p class="text-xs text-gray-400">{{ currentTrack.artist }}</p>
        </div>
      </div>

      <!-- Player Controls -->
      <div class="flex flex-col items-center w-2/4">
        <div class="flex items-center gap-6 mb-2">
          <button @click="previousTrack" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          <button @click="togglePlay" class="bg-white rounded-full p-2 hover:scale-105 transition-transform">
            <svg v-if="!isPlaying" class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
          <button @click="nextTrack" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-2 w-full">
          <span class="text-xs text-gray-400">{{ formatTime(currentTime) }}</span>
          <div class="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer" @click="handleSeek">
            <div class="h-1 bg-white rounded-full" :style="{ width: `${progress}%` }"></div>
          </div>
          <span class="text-xs text-gray-400">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center gap-2 w-1/4 justify-end">
        <button @click="toggleMute" class="text-gray-400 hover:text-white transition-colors">
          <svg v-if="!isMuted" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        </button>
        <div class="w-24 h-1 bg-gray-600 rounded-full cursor-pointer" @click="handleVolume">
          <div class="h-1 bg-white rounded-full" :style="{ width: `${volume}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  initializePlayer,
  togglePlay,
  previousTrack,
  nextTrack,
  seek,
  setVolume,
  isPlaying,
  currentTrack,
  currentTime,
  duration,
  volume
} = useSpotifyPlayer()

const isMuted = ref(false)
const progress = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const formatTime = (time) => {
  const minutes = Math.floor(time / 1000 / 60)
  const seconds = Math.floor((time / 1000) % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const handleSeek = async (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = x / rect.width
  const position = Math.floor(duration.value * percentage)
  await seek(position)
}

const handleVolume = async (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = (x / rect.width) * 100
  await setVolume(percentage)
}

const toggleMute = async () => {
  isMuted.value = !isMuted.value
  await setVolume(isMuted.value ? 0 : 100)
}

// Initialize the player when the component is mounted
onMounted(() => {
  initializePlayer()
})
</script> 