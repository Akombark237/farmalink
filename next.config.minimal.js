/** @type {import('next').NextConfig} */
// Ultra-minimal Next.js configuration for memory-constrained environments
const nextConfig = {
  // Disable all experimental features
  experimental: {
    workerThreads: false,
    optimizeCss: false,
    swcMinify: false, // Disable SWC to save memory
    serverComponentsExternalPackages: [],
    esmExternals: false,
  },

  // Minimal webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable all optimizations in development
      config.optimization = {
        minimize: false,
        splitChunks: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        mergeDuplicateChunks: false,
      };

      // Disable source maps completely
      config.devtool = false;

      // Minimal watch options
      config.watchOptions = {
        poll: 5000, // Very slow polling
        aggregateTimeout: 1000,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      };

      // Disable stats
      config.stats = false;

      // Minimal module resolution
      config.resolve.modules = ['node_modules'];
      config.resolve.symlinks = false;
    }

    // Reduce bundle analysis
    config.infrastructureLogging = { level: 'error' };

    return config;
  },

  // Disable all image optimization
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js'
  },

  // Skip all checks
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable telemetry
  telemetry: false,

  // Minimal compiler options
  compiler: {
    removeConsole: false,
    reactRemoveProperties: false,
  },

  // Disable static optimization
  staticPageGenerationTimeout: 0,

  // Single concurrent operation
  concurrency: 1,

  // Disable all headers, redirects, rewrites
  async headers() {
    return [];
  },

  async redirects() {
    return [];
  },

  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
