/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "media.tenor.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "cdn.pixabay.com"
    ]
  },
  env: {
    CLOUDINARY_CLOUD_NAME: 'dqmeg9ltr',
    CLOUDINARY_API_KEY: '373698988825754',
    CLOUDINARY_API_SECRET: 'AT0elXDQhA9ogz1SaPtcDIG0g-I',
  },
}

module.exports = nextConfig
