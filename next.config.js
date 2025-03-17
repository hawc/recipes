/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "recipes.hawc.de"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "recipes.hawc.de",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
