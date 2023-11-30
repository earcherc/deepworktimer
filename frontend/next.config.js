/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tailwindui.com', 'images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  }
}

module.exports = nextConfig
