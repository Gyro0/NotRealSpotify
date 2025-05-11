<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954] mx-auto mb-4"></div>
      <p class="text-white">Completing login...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { handleCallback } = useAuth()

onMounted(async () => {
  const code = route.query.code?.toString()
  if (code) {
    await handleCallback(code)
    router.push('/')
  } else {
    router.push('/')
  }
})
</script> 