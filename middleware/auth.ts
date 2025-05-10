export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  // List of routes that require authentication
  const protectedRoutes = ['/playlists', '/profile', '/search']
  
  if (protectedRoutes.includes(to.path) && !isAuthenticated()) {
    return navigateTo('/')
  }
}) 