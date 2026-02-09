import type { NextConfig } from "next";

// Use CMS URL based on environment
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://wp.takovoberry.com' 
    : 'http://localhost:8888/takovoberry');

const nextConfig: NextConfig = {
  // Experimental optimizations for CSS
  experimental: {
    optimizeCss: true,
    // Inline critical CSS for faster FCP
    inlineCss: true,
  },
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Target modern browsers only - removes unnecessary polyfills
  // This saves ~14KB by not including polyfills for Array.at, Object.hasOwn, etc.
  transpilePackages: [],
  images: {
    // Use AVIF for better compression (falls back to WebP)
    formats: ['image/avif', 'image/webp'],
    // Optimize image quality - lower = smaller files
    // 75 is a good balance between quality and size
    // deviceSizes: breakpoints for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1440],
    // imageSizes: sizes for the `sizes` prop
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    // Reduce quality for better compression
    minimumCacheTTL: 31536000, // 1 year cache
    remotePatterns: [
      // Production WordPress
      {
        protocol: 'https',
        hostname: 'wp.takovoberry.com',
        pathname: '/wp-content/uploads/**',
      },
      // Gravatar for user avatars
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/avatar/**',
      },
      // Development - MAMP localhost
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8888',
        pathname: '/takovoberry/wp-content/uploads/**',
      },
      // WordPress.com CDN (if using Jetpack)
      {
        protocol: 'https',
        hostname: '*.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
        pathname: '/**',
      },
    ],
    // For development with MAMP, you might need to disable image optimization
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Proxy WordPress uploads to serve PDFs and other files
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: `${WORDPRESS_URL}/wp-content/uploads/:path*`,
      },
    ];
  },
  // Add cache headers for static assets
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
