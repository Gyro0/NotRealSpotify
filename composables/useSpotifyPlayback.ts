import { ref, watch } from 'vue'

interface SpotifyArtist {
  name: string
  id: string
}

interface SpotifyAlbum {
  images: Array<{ url: string }>
  name: string
}

interface SpotifyTrack {
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  duration_ms: number
  uri: string
}

interface SpotifyError {
  message: string
  error?: string
  error_description?: string
}

export const useSpotifyPlayback = () => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  const { accessToken, refreshAccessToken } = useAuth()
  const isPlaying = ref(false)
  const currentTrack = ref<SpotifyTrack | null>(null)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(50)
  const error = ref('')

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    if (!accessToken.value) {
      return null
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          await refreshAccessToken()
          return fetchWithAuth(endpoint, options)
        }
        const data = await response.json() as SpotifyError
        throw new Error(data.error_description || data.error || 'Failed to fetch from Spotify')
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return true
      }

      return response.json()
    } catch (err) {
      console.error('Error in fetchWithAuth:', err)
      return null
    }
  }

  const getCurrentPlayback = async () => {
    try {
      const data = await fetchWithAuth('/me/player')
      if (data) {
        isPlaying.value = data.is_playing
        currentTrack.value = data.item
        currentTime.value = data.progress_ms
        duration.value = data.item?.duration_ms || 0
        volume.value = data.device?.volume_percent || 50
      }
    } catch (err: unknown) {
      console.error('Error getting playback state:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }

  const togglePlay = async () => {
    try {
      if (isPlaying.value) {
        await fetchWithAuth('/me/player/pause', { method: 'PUT' })
      } else {
        await fetchWithAuth('/me/player/play', { method: 'PUT' })
      }
      isPlaying.value = !isPlaying.value
    } catch (err: unknown) {
      console.error('Error toggling play:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }

  const playTrack = async (trackUri: string) => {
    try {
      await fetchWithAuth('/me/player/play', {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri] })
      })
      isPlaying.value = true
      await getCurrentPlayback()
    } catch (err: unknown) {
      console.error('Error playing track:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }

  const playPlaylist = async (playlistUri: string) => {
    try {
      await fetchWithAuth('/me/player/play', {
        method: 'PUT',
        body: JSON.stringify({ context_uri: playlistUri })
      })
      isPlaying.value = true
      await getCurrentPlayback()
    } catch (err: unknown) {
      console.error('Error playing playlist:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }

  const nextTrack = async () => {
    try {
      await fetchWithAuth('/me/player/next', { method: 'POST' })
      await getCurrentPlayback()
    } catch (err: unknown) {
      console.error('Error skipping to next track:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }

  const previousTrack = async () => {
    try {
      await fetchWithAuth('/me/player/previous', { method: 'POST' })
      await getCurrentPlayback()
    } catch (err: unknown) {
      console.error('Error going to previous track:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }

  const setVolume = async (newVolume: number) => {
    try {
      const response = await fetchWithAuth(`/me/player/volume?volume_percent=${newVolume}`, { method: 'PUT' })
      if (response !== null) {
        volume.value = newVolume
      }
    } catch (err: unknown) {
      console.error('Error setting volume:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }

  const seek = async (position: number) => {
    try {
      await fetchWithAuth(`/me/player/seek?position_ms=${position}`, { method: 'PUT' })
      currentTime.value = position
    } catch (err: unknown) {
      console.error('Error seeking:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }

  // Poll for playback updates
  let pollInterval: NodeJS.Timeout | null = null

  const startPolling = () => {
    if (pollInterval || !accessToken.value) return
    pollInterval = setInterval(getCurrentPlayback, 1000)
  }

  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  }

  // Watch for access token changes
  watch(accessToken, (newToken) => {
    if (newToken) {
      startPolling()
    } else {
      stopPolling()
    }
  })

  return {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    error,
    togglePlay,
    playTrack,
    playPlaylist,
    nextTrack,
    previousTrack,
    setVolume,
    seek,
    getCurrentPlayback,
    startPolling,
    stopPolling
  }
} 