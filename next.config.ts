import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for GitHub Pages
  basePath: '/srs-website', // GitHub Pages subdirectory path
  env: {
    NEXT_PUBLIC_BASE_PATH: '/srs-website',
  },
  images: {
    unoptimized: true, // Required for static export
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
