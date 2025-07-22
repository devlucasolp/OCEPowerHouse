/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'cdn.sanity.io', // Sanity
      'images.unsplash.com', // Exemplo de domínio externo
    ],
  },
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
