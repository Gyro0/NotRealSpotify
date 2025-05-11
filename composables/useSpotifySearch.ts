import { ref } from 'vue'
import { useAuth } from './useAuth'

export const useSpotifySearch = () => {
  const { accessToken, refreshAccessToken } = useAuth()

  const search = async (query: string) => {
    if (!accessToken.value) {
      throw new Error('No access token available')
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken.value}`
          }
        }
      )

      if (!response.ok) {
        if (response.status === 401) {
          await refreshAccessToken()
          return search(query)
        }
        throw new Error('Failed to search')
      }

      return response.json()
    } catch (error) {
      console.error('Search error:', error)
      throw error
    }
  }

  return {
    search
  }
} 