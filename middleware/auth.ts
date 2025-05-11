export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  // List of protected routes
  const protectedRoutes = ['/search', '/playlist', '/profile']
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))
  
  if (isProtectedRoute && !isAuthenticated()) {
    // Redirect to home page if trying to access protected route while not authenticated
    return navigateTo('/')
  }
}) 