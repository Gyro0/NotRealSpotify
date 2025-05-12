import { ref, watch } from 'vue'

// Create singleton state
const accessToken = ref('')
const refreshToken = ref('')

export const useAuth = () => {
  const config = useRuntimeConfig()

  // Initialize tokens from localStorage if available
  if (process.client && !accessToken.value) {
    const storedAccessToken = localStorage.getItem('spotify_access_token')
    const storedRefreshToken = localStorage.getItem('spotify_refresh_token')
    console.log('Initializing tokens from localStorage:', {
      hasAccessToken: !!storedAccessToken,
      hasRefreshToken: !!storedRefreshToken
    })
    accessToken.value = storedAccessToken || ''
    refreshToken.value = storedRefreshToken || ''
  }

  // Watch for token changes and update localStorage
  watch(accessToken, (newToken) => {
    if (process.client && newToken) {
      console.log('Access token changed, updating localStorage')
      localStorage.setItem('spotify_access_token', newToken)
    }
  })

  watch(refreshToken, (newToken) => {
    if (process.client && newToken) {
      console.log('Refresh token changed, updating localStorage')
      localStorage.setItem('spotify_refresh_token', newToken)
    }
  })

  const refreshAccessToken = async () => {
    try {
      console.log('Attempting to refresh token...')
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken.value,
        client_id: config.public.spotifyClientId,
        client_secret: config.public.spotifyClientSecret
      })

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Token refresh failed:', {
          status: response.status,
          error: errorData
        })
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      console.log('Token refresh successful')
      
      // Update tokens
      accessToken.value = data.access_token
      if (data.refresh_token) {
        refreshToken.value = data.refresh_token
      }

      return data.access_token
    } catch (error) {
      console.error('Error refreshing token:', error)
      logout()
      throw error
    }
  }

  const login = () => {
    try {
      const clientId = config.public.spotifyClientId
      const redirectUri = config.public.spotifyRedirectUri.replace(/\/$/, '') // Remove trailing slash
      const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-modify-private playlist-modify-public user-top-read user-read-recently-played user-library-read'
      
      // Debug logging
      console.log('Auth Configuration:', {
        clientId,
        redirectUri,
        scope,
        config: config.public
      })
      
      if (!clientId) {
        throw new Error('Spotify Client ID is not configured')
      }
      
      if (!redirectUri) {
        throw new Error('Spotify Redirect URI is not configured')
      }
      
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
      
      // Debug logging
      console.log('Generated Auth URL:', authUrl)
      
      if (process.client) {
        window.location.href = authUrl
      }
    } catch (error) {
      console.error('Error in login:', error)
      throw error
    }
  }

  const handleCallback = async (code: string) => {
    try {
      console.log('Starting callback handling')
      const redirectUri = config.public.spotifyRedirectUri.replace(/\/$/, '') // Remove trailing slash
      console.log('Using redirect URI:', redirectUri)

      if (!config.public.spotifyClientId || !config.public.spotifyClientSecret) {
        throw new Error('Spotify credentials are not properly configured')
      }

      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: config.public.spotifyClientId,
        client_secret: config.public.spotifyClientSecret
      })

      console.log('Token request params:', {
        redirect_uri: redirectUri,
        client_id: config.public.spotifyClientId,
      })

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })

      const data = await response.json()
      
      console.log('Token response status:', response.status)
      if (!response.ok) {
        console.error('Token request failed:', data)
        throw new Error(`Authentication failed: ${data.error_description || data.error || 'Unknown error'}`)
      }

      if (!data.access_token) {
        throw new Error('No access token received')
      }

      console.log('Setting tokens...')
      // Update tokens
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token

      console.log('Authentication successful, token set:', {
        hasAccessToken: !!accessToken.value,
        hasRefreshToken: !!refreshToken.value
      })
    } catch (error) {
      console.error('Error during authentication:', error)
      throw error
    }
  }

  const logout = () => {
    console.log('Logging out...')
    accessToken.value = ''
    refreshToken.value = ''
    if (process.client) {
      localStorage.removeItem('spotify_access_token')
      localStorage.removeItem('spotify_refresh_token')
    }
    navigateTo('/')
  }

  const isAuthenticated = () => {
    const authenticated = !!accessToken.value
    console.log('Checking authentication:', { 
      authenticated,
      hasAccessToken: !!accessToken.value,
      tokenLength: accessToken.value.length
    })
    return authenticated
  }

  return {
    login,
    handleCallback,
    logout,
    isAuthenticated,
    accessToken,
    refreshToken,
    refreshAccessToken
  }
} 