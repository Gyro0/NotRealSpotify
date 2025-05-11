<template>
  <div class="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4">
    <div class="max-w-screen-xl mx-auto flex items-center justify-between">
      <!-- Track Info -->
      <div class="flex items-center space-x-4 w-1/3">
        <img 
          v-if="currentTrack?.album?.images[0]?.url" 
          :src="currentTrack.album.images[0].url" 
          :alt="currentTrack.name"
          class="w-14 h-14 rounded"
        />
        <div>
          <h3 class="text-white font-medium">{{ currentTrack?.name || 'No track playing' }}</h3>
          <p class="text-gray-400 text-sm">{{ currentTrack?.artists?.map(artist => artist.name).join(', ') }}</p>
        </div>
      </div>

      <!-- Player Controls -->
      <div class="flex flex-col items-center w-1/3">
        <div class="flex items-center space-x-6">
          <button @click="previousTrack" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          <button @click="togglePlay" class="text-white bg-white rounded-full p-2 hover:scale-105 transition">
            <svg v-if="!isPlaying" class="w-6 h-6" fill="black" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="black" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
          <button @click="nextTrack" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full flex items-center space-x-2 mt-2">
          <span class="text-gray-400 text-xs">{{ formatTime(currentTime) }}</span>
          <div class="flex-1 h-1 bg-gray-600 rounded-full">
            <div 
              class="h-full bg-[#1DB954] rounded-full"
              :style="{ width: `${(currentTime / duration) * 100}%` }"
            ></div>
          </div>
          <span class="text-gray-400 text-xs">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-2 w-1/3 justify-end">
        <button @click="toggleMute" class="text-gray-400 hover:text-white">
          <svg v-if="volume === 0" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
          <svg v-else-if="volume < 50" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 9v6h4l5 5V4L9 9H5zm7-.17v6.34L9.83 13H7v-2h2.83L12 8.83z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </button>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="volume" 
          @input="handleVolume"
          class="w-24"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useSpotifyPlayback } from '~/composables/useSpotifyPlayback'

const {
  isPlaying,
  currentTrack,
  currentTime,
  duration,
  volume,
  error,
  togglePlay,
  nextTrack,
  previousTrack,
  setVolume,
  seek,
  startPolling,
  stopPolling
} = useSpotifyPlayback()

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const handleVolume = (event: Event) => {
  const target = event.target as HTMLInputElement
  setVolume(parseInt(target.value))
}

const toggleMute = () => {
  setVolume(volume.value === 0 ? 50 : 0)
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script> 