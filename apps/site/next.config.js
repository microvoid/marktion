/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  }
};

if (process.env.BUILD_TARGET === 'desktop') {
  nextConfig.output = 'export';
}

module.exports = nextConfig;
