/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Disable src directory scanning - we use /app at root level
  // This prevents conflicts with Vite's /src/pages structure
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  
  // Map Vite environment variables to Next.js
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  },
  
  // Output standalone for better deployment
  output: 'standalone',
}

export default nextConfig
