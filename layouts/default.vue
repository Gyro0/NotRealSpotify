<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Sidebar -->
    <div class="fixed top-0 left-0 w-64 h-full bg-[#121212] p-6">
      <div class="mb-8">
        <NuxtLink to="/" class="block">
          <svg class="w-32 hover:opacity-80 transition-opacity" viewBox="0 0 1134 340" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-32-19-76-28-141-27-42 1-48 8-54 8zm189 91c-16 0-33-7-33-20 0-12 17-20 33-20 16 0 33 8 33 20 0 13-17 20-33 20zm-111-41c-9 3-18-9-9-13 49-14 163-10 205 17 11 7-1 22-12 14-40-26-144-21-184-18z" />
          </svg>
        </NuxtLink>
      </div>
      <nav class="space-y-6">
        <NuxtLink to="/" class="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Home</span>
        </NuxtLink>
        <NuxtLink to="/search" class="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <span>Search</span>
        </NuxtLink>
        <NuxtLink to="/playlists" class="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4z"/>
          </svg>
          <span>Your Library</span>
        </NuxtLink>
        <NuxtLink to="/profile" class="flex items-center space-x-4 text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>Profile</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Navigation Bar -->
      <div class="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 flex items-center justify-between">
        <NavigationButtons />
        <div v-if="isAuthenticated()" class="flex items-center space-x-4">
          <button @click="logout" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Page Content -->
      <div class="p-8">
        <slot />
      </div>
    </div>

    <!-- Player -->
    <div v-if="isAuthenticated()" class="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-800 p-4">
      <div class="container mx-auto flex items-center justify-between">
        <!-- Now Playing -->
        <div class="flex items-center space-x-4">
          <img
            v-if="currentTrack?.album?.images?.[0]?.url"
            :src="currentTrack.album.images[0].url"
            :alt="currentTrack?.name"
            class="w-14 h-14 rounded"
          />
          <div>
            <p class="font-medium">{{ currentTrack?.name }}</p>
            <p class="text-sm text-gray-400">{{ currentTrack?.artists?.map(artist => artist.name).join(', ') }}</p>
          </div>
        </div>

        <!-- Player Controls -->
        <div class="flex items-center space-x-4">
          <button @click="previousTrack" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          <button @click="togglePlay" class="text-white bg-white rounded-full p-2 hover:scale-110 transition-transform">
            <svg v-if="!isPlaying" class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>
          <button @click="nextTrack" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        <!-- Volume Control -->
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <input
            type="range"
            v-model="volume"
            min="0"
            max="100"
            @input="(e) => setVolume(Number((e.target as HTMLInputElement).value))"
            class="w-24"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useSpotifyPlayback } from '~/composables/useSpotifyPlayback'

const { isAuthenticated, logout } = useAuth()
const { 
  isPlaying, 
  currentTrack, 
  volume, 
  togglePlay, 
  nextTrack, 
  previousTrack, 
  setVolume 
} = useSpotifyPlayback()
</script>

<style>
.router-link-active {
  @apply text-white;
}
</style> 