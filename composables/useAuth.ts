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
    
    // Debug logging
    console.log('Auth Configuration:', {
      clientId,
      redirectUri,
      scope,
      config: config.public
    })
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
    
    // Debug logging
    console.log('Generated Auth URL:', authUrl)
    
    if (process.client) {
      window.location.href = authUrl
    }
  }

  const handleCallback = async (code: string) => {
    try {
      // Debug logging
      console.log('Callback received with code:', code)
      console.log('Using redirect URI:', config.public.spotifyRedirectUri)

      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.public.spotifyRedirectUri,
        client_id: config.public.spotifyClientId,
        client_secret: config.public.spotifyClientSecret
      })

      // Debug logging
      console.log('Token request params:', {
        redirect_uri: config.public.spotifyRedirectUri,
        client_id: config.public.spotifyClientId,
        // Don't log the client secret for security
      })

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })

      const data = await response.json()
      
      // Debug logging
      if (!response.ok) {
        console.error('Token request failed:', data)
      }

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