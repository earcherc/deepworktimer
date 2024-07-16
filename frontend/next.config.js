/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'tailwindui.com',
      'images.unsplash.com',
      'i.imgur.com',
      `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com`,
      new URL(process.env.NEXT_PUBLIC_API_URL).hostname,
    ].filter(Boolean),
  },
  experimental: {},
};

module.exports = nextConfig;
