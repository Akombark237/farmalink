/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for Render deployment
  // output: 'standalone', // Only for Docker deployments
  
  // Optimize memory usage
  experimental: {
    // Reduce memory usage during compilation
    workerThreads: false,
  },

  // Webpack configuration for memory optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize memory usage
    config.optimization = {
      ...config.optimization,
      // Reduce memory usage
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    };

    // Memory optimization for large projects
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next', '**/phamarlink', '**/*.py'],
      };
    }

    return config;
  },

  // Image optimization
  images: {
    domains: ['localhost', 'via.placeholder.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Reduce compilation time
  typescript: {
    // Skip type checking during build (for faster builds)
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Skip ESLint during build for faster compilation
    ignoreDuringBuilds: false,
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Trailing slash configuration
  trailingSlash: false,

  // Compression
  compress: true,



  // Redirects
  async redirects() {
    return [];
  },

  // Rewrites
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
