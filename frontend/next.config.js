/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // allow production builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  // optional: smaller server bundle for pm2
  output: "standalone",
  images: {
    domains: [
      "images.pexels.com",
      "pexels.com",
      "slelguoygbfzlpylpxfs.supabase.co",
      "assets.example.com",
      "assets..site",
      "example.com",
      "shop.example.com",
    ],
  },
  experimental: {},
};

module.exports = nextConfig;
