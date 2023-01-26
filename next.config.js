/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'receipes.hawc.de'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'receipes.hawc.de',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
