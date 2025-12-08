import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for GitHub Pages
  basePath: '/srs-website', // GitHub Pages subdirectory path
  images: {
    unoptimized: true, // Required for static export
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
