import { ref } from 'vue'

export const useSpotifyPlayer = () => {
  const player = ref(null)
  const deviceId = ref(null)
  const isPlaying = ref(false)
  const currentTrack = ref(null)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(100)

  const initializePlayer = async () => {
    if (!window.Spotify) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)

      await new Promise((resolve) => {
        window.onSpotifyWebPlaybackSDKReady = resolve
      })
    }

    player.value = new window.Spotify.Player({
      name: 'Spotify Clone Web Player',
      getOAuthToken: cb => {
        const { accessToken } = useAuth()
        cb(accessToken.value)
      },
      volume: 0.5
    })

    // Error handling
    player.value.addListener('initialization_error', ({ message }) => {
      console.error('Failed to initialize:', message)
    })

    player.value.addListener('authentication_error', ({ message }) => {
      console.error('Failed to authenticate:', message)
    })

    player.value.addListener('account_error', ({ message }) => {
      console.error('Failed to validate Spotify account:', message)
    })

    player.value.addListener('playback_error', ({ message }) => {
      console.error('Failed to perform playback:', message)
    })

    // Playback status updates
    player.value.addListener('player_state_changed', state => {
      if (!state) return

      currentTrack.value = {
        name: state.track_window.current_track.name,
        artist: state.track_window.current_track.artists[0].name,
        albumArt: state.track_window.current_track.album.images[0].url
      }

      isPlaying.value = !state.paused
      currentTime.value = state.position
      duration.value = state.duration
    })

    // Ready
    player.value.addListener('ready', ({ device_id }) => {
      deviceId.value = device_id
      console.log('Ready with Device ID', device_id)
    })

    // Not Ready
    player.value.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id)
    })

    // Connect to the player
    await player.value.connect()
  }

  const togglePlay = async () => {
    if (!player.value) return

    if (isPlaying.value) {
      await player.value.pause()
    } else {
      await player.value.resume()
    }
  }

  const previousTrack = async () => {
    if (!player.value) return
    await player.value.previousTrack()
  }

  const nextTrack = async () => {
    if (!player.value) return
    await player.value.nextTrack()
  }

  const seek = async (position) => {
    if (!player.value) return
    await player.value.seek(position)
  }

  const setVolume = async (value) => {
    if (!player.value) return
    await player.value.setVolume(value / 100)
    volume.value = value
  }

  const playTrack = async (trackUri) => {
    if (!player.value || !deviceId.value) return

    try {
      const { accessToken } = useAuth()
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId.value}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [trackUri]
        })
      })
    } catch (error) {
      console.error('Error playing track:', error)
    }
  }

  return {
    initializePlayer,
    togglePlay,
    previousTrack,
    nextTrack,
    seek,
    setVolume,
    playTrack,
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume
  }
} 