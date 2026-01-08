import type { NextConfig } from "next";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8888/takovoberry';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Production WordPress
      {
        protocol: 'https',
        hostname: 'cms.takovoberry.orbu.studio',
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
};

export default nextConfig;
