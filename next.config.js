/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.creatomate.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
