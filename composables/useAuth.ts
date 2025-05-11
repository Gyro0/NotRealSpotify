import { ref } from 'vue'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const accessToken = ref('')
  const refreshToken = ref('')

  // Initialize tokens from localStorage if available
  if (process.client) {
    accessToken.value = localStorage.getItem('spotify_access_token') || ''
    refreshToken.value = localStorage.getItem('spotify_refresh_token') || ''
  }

  const login = () => {
    const clientId = config.public.spotifyClientId
    const redirectUri = config.public.spotifyRedirectUri
    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-modify-private playlist-modify-public'
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`
    
    if (process.client) {
      window.location.href = authUrl
    }
  }

  const handleCallback = async (code: string) => {
    try {
      const response = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token

      if (process.client) {
        localStorage.setItem('spotify_access_token', data.access_token)
        localStorage.setItem('spotify_refresh_token', data.refresh_token)
      }
    } catch (error) {
      console.error('Error during authentication:', error)
    }
  }

  const logout = () => {
    accessToken.value = ''
    refreshToken.value = ''
    if (process.client) {
      localStorage.removeItem('spotify_access_token')
      localStorage.removeItem('spotify_refresh_token')
    }
  }

  const isAuthenticated = () => {
    return !!accessToken.value
  }

  return {
    login,
    handleCallback,
    logout,
    isAuthenticated,
    accessToken,
    refreshToken
  }
} 