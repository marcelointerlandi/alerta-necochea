module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: '/var/www/informatenecochea/backend',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'frontend',
      cwd: '/var/www/informatenecochea/frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        COMING_SOON: 'true',
        PREVIEW_TOKEN: 'Inf2026Necochea_preview',
      },
    },
  ],
};
