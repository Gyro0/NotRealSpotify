<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Sidebar -->
    <div class="fixed left-0 top-0 w-64 h-full bg-[#121212] p-6">
      <!-- Logo -->
      <div class="mb-8">
        <svg class="w-32" viewBox="0 0 1134 340" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-32-19-76-28-141-27-42 1-48 8-54 8zm189 91c-16 0-33-7-33-20 0-12 17-20 33-20 16 0 33 8 33 20 0 13-17 20-33 20zm-111-41c-9 3-18-9-9-13 49-14 163-10 205 17 11 7-1 22-12 14-40-26-144-21-184-18z" />
        </svg>
      </div>

      <!-- Navigation -->
      <nav class="space-y-4">
        <NuxtLink to="/" class="flex items-center gap-4 text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          Home
        </NuxtLink>
        <NuxtLink to="/search" class="flex items-center gap-4 text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          Search
        </NuxtLink>
        <NuxtLink to="/playlists" class="flex items-center gap-4 text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4z"/>
          </svg>
          Your Library
        </NuxtLink>
        <NuxtLink to="/profile" class="flex items-center gap-4 text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Profile
        </NuxtLink>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="ml-64 p-8">
      <slot />
    </div>

    <!-- Music Player -->
    <div class="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-800 p-4">
      <MusicPlayer />
    </div>
  </div>
</template>

<script setup>
// The layout will automatically use the MusicPlayer component
</script>

<style>
.router-link-active {
  @apply text-white;
}
</style> 