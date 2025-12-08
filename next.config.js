const path = require('path');
const withNextIntl = require('next-intl/plugin')(
  path.resolve(__dirname, './lib/i18n-request.ts')
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  output: 'standalone',
}

module.exports = withNextIntl(nextConfig)
