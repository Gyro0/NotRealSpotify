<template>
  <div>
    <div class="flex items-center space-x-6 mb-8">
      <div class="w-32 h-32 bg-gray-600 rounded-full"></div>
      <div>
        <h1 class="text-3xl font-bold">{{ userProfile.display_name }}</h1>
        <p class="text-gray-400">{{ userProfile.followers?.total }} followers</p>
      </div>
    </div>

    <!-- User Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="bg-gray-800 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-2">Top Artists</h3>
        <div class="space-y-4">
          <div v-for="artist in topArtists" :key="artist.id" class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gray-600 rounded-full"></div>
            <div>
              <p class="font-medium">{{ artist.name }}</p>
              <p class="text-sm text-gray-400">Artist</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-2">Top Tracks</h3>
        <div class="space-y-4">
          <div v-for="track in topTracks" :key="track.id" class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gray-600 rounded"></div>
            <div>
              <p class="font-medium">{{ track.name }}</p>
              <p class="text-sm text-gray-400">{{ track.artists[0].name }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-2">Recently Played</h3>
        <div class="space-y-4">
          <div v-for="item in recentlyPlayed" :key="item.track.id" class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gray-600 rounded"></div>
            <div>
              <p class="font-medium">{{ item.track.name }}</p>
              <p class="text-sm text-gray-400">{{ item.track.artists[0].name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Button -->
    <button
      @click="logout"
      class="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { accessToken, logout } = useAuth()
const userProfile = ref({})
const topArtists = ref([])
const topTracks = ref([])
const recentlyPlayed = ref([])

// Fetch user profile
const fetchUserProfile = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    userProfile.value = await response.json()
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

// Fetch top artists
const fetchTopArtists = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    topArtists.value = data.items
  } catch (error) {
    console.error('Error fetching top artists:', error)
  }
}

// Fetch top tracks
const fetchTopTracks = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    topTracks.value = data.items
  } catch (error) {
    console.error('Error fetching top tracks:', error)
  }
}

// Fetch recently played
const fetchRecentlyPlayed = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=5', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })
    const data = await response.json()
    recentlyPlayed.value = data.items
  } catch (error) {
    console.error('Error fetching recently played:', error)
  }
}

// Fetch all data when component is mounted
onMounted(() => {
  if (accessToken.value) {
    fetchUserProfile()
    fetchTopArtists()
    fetchTopTracks()
    fetchRecentlyPlayed()
  }
})
</script> 