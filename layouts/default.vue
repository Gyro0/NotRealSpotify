<template>
  <div class="min-h-screen bg-[#121212] text-white">
    <!-- Sidebar -->
    <div class="fixed left-0 top-0 bottom-0 w-64 bg-black p-6">
      <div class="mb-8">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <img src="/spotify-logo.png" alt="Spotify" class="w-8 h-8" />
          <span class="text-xl font-bold">Not Real Spotify</span>
        </NuxtLink>
      </div>

      <nav class="space-y-2">
        <NuxtLink 
          to="/" 
          class="flex items-center space-x-3 text-gray-400 hover:text-white p-2"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <span>Home</span>
        </NuxtLink>

        <NuxtLink 
          to="/search" 
          class="flex items-center space-x-3 text-gray-400 hover:text-white p-2"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <span>Search</span>
        </NuxtLink>

        <NuxtLink 
          to="/playlists" 
          class="flex items-center space-x-3 text-gray-400 hover:text-white p-2"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z"/>
          </svg>
          <span>Your Library</span>
        </NuxtLink>
      </nav>

      <div class="mt-8 pt-8 border-t border-gray-800">
        <div v-if="isAuthenticated()" class="space-y-4">
          <NuxtLink 
            to="/profile" 
            class="flex items-center space-x-3 text-gray-400 hover:text-white p-2"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>Profile</span>
          </NuxtLink>
          <button 
            @click="logout" 
            class="w-full flex items-center space-x-3 text-gray-400 hover:text-white p-2"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
        <div v-else class="space-y-4">
          <NuxtLink 
            to="/login" 
            class="flex items-center space-x-3 text-gray-400 hover:text-white p-2"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
            </svg>
            <span>Login</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64 p-8">
      <slot />
    </div>

    <!-- Music Player -->
    <MusicPlayer />
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