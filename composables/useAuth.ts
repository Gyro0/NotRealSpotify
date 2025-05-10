import { ref } from 'vue'

const config = useRuntimeConfig()
const accessToken = ref('')
const refreshToken = ref('')

export const useAuth = () => {
  const login = () => {
    const clientId = config.public.spotifyClientId
    const redirectUri = config.public.spotifyRedirectUri
    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-modify-private playlist-modify-public'
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`
    
    window.location.href = authUrl
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

      // Store tokens in localStorage
      localStorage.setItem('spotify_access_token', data.access_token)
      localStorage.setItem('spotify_refresh_token', data.refresh_token)
    } catch (error) {
      console.error('Error during authentication:', error)
    }
  }

  const logout = () => {
    accessToken.value = ''
    refreshToken.value = ''
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_refresh_token')
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