<template>
  <div class="flex items-center space-x-4">
    <button 
      @click="goBack" 
      class="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:bg-[#282828]"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </button>
    <button 
      @click="goForward" 
      class="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:bg-[#282828]"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canGoBack = ref(false)
const canGoForward = ref(false)

const updateNavigationState = () => {
  canGoBack.value = window.history.length > 1
  canGoForward.value = window.history.length > 1
}

const goBack = () => {
  navigateTo(-1 as any) 
}

const goForward = () => {
  navigateTo(1 as any) 
}

onMounted(() => {
  updateNavigationState()
  window.addEventListener('popstate', updateNavigationState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', updateNavigationState)
})
</script>