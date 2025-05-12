# Not Real Spotify - Spotify Clone
#### Deployment link 

https://not-real-spotify.vercel.app


A Spotify clone built with Nuxt 3, Vue 3, and TailwindCSS. This application allows users to connect to their real Spotify accounts, browse music, create and manage playlists, and play music through the Spotify Web Playback SDK.


## Features

- Spotify OAuth authentication
- Browse recently played tracks
- Search for songs, artists, albums, and playlists
- View artist details and top tracks
- View and play albums
- Create, edit, and delete playlists
- Manage playlist tracks
- User profile management
- Web playback controls using Spotify's Web Playback SDK

## Tech Stack

- **Frontend Framework**: Nuxt 3 / Vue 3
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **TypeScript**
- **Authentication**: Spotify OAuth flow

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Project Configuration

Before running the application, you need to configure your Spotify API credentials in `nuxt.config.ts`:

```typescript
runtimeConfig: {
  public: {      
    spotifyClientId: "YOUR_SPOTIFY_CLIENT_ID",
    spotifyRedirectUri: 'YOUR_REDIRECT_URI',
    spotifyClientSecret: "YOUR_SPOTIFY_CLIENT_SECRET"
  }
}
```
