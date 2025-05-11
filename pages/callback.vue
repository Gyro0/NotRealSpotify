<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954] mx-auto mb-4"></div>
      <p class="text-white">Completing login...</p>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { handleCallback, isAuthenticated } = useAuth()
const error = ref('')

onMounted(async () => {
  try {
    console.log('Callback page mounted')
    const code = route.query.code?.toString()
    
    if (!code) {
      console.error('No authorization code found in URL')
      error.value = 'No authorization code found'
      setTimeout(() => router.push('/'), 2000)
      return
    }

    console.log('Processing authorization code...')
    await handleCallback(code)
    
    // Verify authentication was successful
    if (isAuthenticated()) {
      console.log('Authentication verified, redirecting to playlists...')
      router.push('/playlists')
    } else {
      console.error('Authentication failed - token not set')
      error.value = 'Authentication failed - please try again'
      setTimeout(() => router.push('/'), 2000)
    }
  } catch (err) {
    console.error('Error in callback:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred during login'
    setTimeout(() => router.push('/'), 2000)
  }
})
</script> 