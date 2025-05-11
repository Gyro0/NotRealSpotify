<template>
  <div class="flex items-center space-x-4">
    <button 
      @click="goBack" 
      class="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors"
      :disabled="!canGoBack"
    >
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button 
      @click="goForward" 
      class="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors"
      :disabled="!canGoForward"
    >
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const canGoBack = ref(false)
const canGoForward = ref(false)

const updateNavigationState = () => {
  canGoBack.value = window.history.length > 1
  canGoForward.value = window.history.length > 1
}

const goBack = () => {
  router.back()
}

const goForward = () => {
  router.forward()
}

onMounted(() => {
  updateNavigationState()
  window.addEventListener('popstate', updateNavigationState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', updateNavigationState)
})
</script> 