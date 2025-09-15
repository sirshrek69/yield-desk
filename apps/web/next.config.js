/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tfi/sdk'],
  images: {
    domains: ['cdn.jsdelivr.net', 'logo.clearbit.com'],
    unoptimized: false,
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://yield-desk.com',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_PRICE_SERVICE_URL || 'http://localhost:4001'}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
