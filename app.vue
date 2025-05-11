<template>
  <div>
    <NuxtLayout v-if="isAuthenticated()">
      <NuxtPage />
    </NuxtLayout>
    <NuxtPage v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const { isAuthenticated } = useAuth()
const route = useRoute()

// Check authentication state on mount and when route changes
onMounted(() => {
  if (!isAuthenticated() && route.path !== '/' && route.path !== '/callback') {
    navigateTo('/')
  }
})

watch(() => route.path, (path) => {
  if (!isAuthenticated() && path !== '/' && path !== '/callback') {
    navigateTo('/')
  }
}, { immediate: true })
</script>
