/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "pexels.com",
      "slelguoygbfzlpylpxfs.supabase.co",
      "assets.retinabd.org",
      "assets.retinabd.site",
      "retinabd.org",
      "shop.retinabd.org",
      
    ],
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;