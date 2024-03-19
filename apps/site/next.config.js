/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['marktion'],
  images: {
    domains: ['avatars.githubusercontent.com', 'cdn.marktion.io']
  }
};

module.exports = nextConfig;
