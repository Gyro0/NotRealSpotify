import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { code } = body

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${config.public.spotifyClientId}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.public.spotifyRedirectUri,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error exchanging code for token:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to exchange code for token',
    })
  }
}) 