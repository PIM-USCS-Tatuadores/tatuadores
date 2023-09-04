/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites() {
    return [
      {
        source: '/',
        destination: '/login'
      }
    ]
  }
}

module.exports = nextConfig
