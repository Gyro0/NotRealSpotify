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
      spotifyClientId: "05f7580aedcf4887a671145c70249399",
      spotifyRedirectUri: 'https://not-real-spotify.vercel.app/callback',
      spotifyClientSecret: "f748052696b24613a6b3a6cdea8cf61a"
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
