module.exports = {
  apps: [
    {
      name: 'ks-markdown-server',
      script: 'npm',
      args: 'run start',
      autorestart: true,
      env: {
        PORT: 3402,
        NODE_ENV: 'production'
      }
    }
  ]
};
