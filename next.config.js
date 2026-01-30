/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ko', 'en', 'ja', 'vi'],
    defaultLocale: 'ko',
  },
}

module.exports = nextConfig
