/** @type {import('next').NextConfig} */
const nextConfig = {};

if (process.env.BUILD_TARGET === 'desktop') {
  nextConfig.output = 'export';
}

module.exports = nextConfig;
