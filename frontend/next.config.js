/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // allow production builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  // optional: smaller server bundle for pm2
  output: 'standalone',
};

module.exports = nextConfig;
