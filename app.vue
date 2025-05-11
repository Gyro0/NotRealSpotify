<template>
  <div>
    <NuxtLayout v-if="isAuthenticated">
      <NuxtPage />
    </NuxtLayout>
    <NuxtPage v-else />
  </div>
</template>

<script setup>
const { isAuthenticated } = useAuth()
const route = useRoute()

// Redirect to login if not authenticated and not on login/callback page
watch(() => route.path, (path) => {
  if (!isAuthenticated && path !== '/' && path !== '/callback') {
    navigateTo('/')
  }
}, { immediate: true })
</script>
