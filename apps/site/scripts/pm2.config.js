module.exports = {
  apps: [
    {
      name: 'marktion-app',
      script: 'npm',
      args: 'run start',
      autorestart: true,
      env: {
        PORT: 3401,
        NODE_ENV: 'production'
      }
    }
  ]
};
