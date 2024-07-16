/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com`,
      },
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_API_URL).hostname,
      },
    ].filter(Boolean),
  },
  experimental: {},
};

module.exports = nextConfig;
