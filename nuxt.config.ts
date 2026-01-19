// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-11',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {      
      spotifyClientId: "spotifyClientId",
      spotifyRedirectUri: 'https://YOURLINK/callback',
      spotifyClientSecret: "spotifyClientSecret"
    }
  },
  app: {
    head: {
      title: 'Not Real Spotify',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/spotify-logo.png' }
      ]
    }
  }
})
