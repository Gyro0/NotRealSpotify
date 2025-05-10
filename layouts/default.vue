<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Sidebar Navigation -->
    <nav class="fixed left-0 top-0 h-full w-64 bg-black p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">Spotify Clone</h1>
      </div>
      <ul class="space-y-4">
        <li>
          <NuxtLink to="/" class="flex items-center space-x-2 text-gray-400 hover:text-white">
            <span>Home</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/search" class="flex items-center space-x-2 text-gray-400 hover:text-white">
            <span>Search</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/playlists" class="flex items-center space-x-2 text-gray-400 hover:text-white">
            <span>Your Playlists</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/profile" class="flex items-center space-x-2 text-gray-400 hover:text-white">
            <span>Profile</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <main class="ml-64 p-8">
      <slot />
    </main>

    <!-- Player -->
    <div class="fixed bottom-0 left-0 right-0 bg-gray-900 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-14 h-14 bg-gray-800 rounded"></div>
          <div>
            <h3 class="text-sm font-medium">Song Title</h3>
            <p class="text-xs text-gray-400">Artist Name</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button class="text-white hover:text-gray-300">Previous</button>
          <button class="text-white hover:text-gray-300">Play/Pause</button>
          <button class="text-white hover:text-gray-300">Next</button>
        </div>
        <div class="w-1/3">
          <div class="h-1 bg-gray-600 rounded-full">
            <div class="h-1 bg-white rounded-full w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic will be added here
</script>

<style>
.router-link-active {
  @apply text-white;
}
</style> 