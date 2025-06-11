// PM2 ecosystem configuration for Node.js deployment
// This is the equivalent of gunicorn for Node.js applications

module.exports = {
  apps: [
    {
      name: 'pharmalink',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto-restart configuration
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G',
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,
      
      // Environment variables
      env_file: '.env.production'
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/Akombark237/pharmalink.git',
      path: '/var/www/pharmalink',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install nodejs npm -y'
    }
  }
};
