/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    // Ignorar erros de ESLint durante o build em produção
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Aplicar CSP apenas nas páginas que não são de checkout/pagamento
        source: '/((?!checkout|api/checkout|api/webhooks).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.recaptcha.net https://www.gstatic.com https://sdk.mercadopago.com https://www.mercadopago.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.mercadopago.com https://www.google.com https://www.recaptcha.net",
              "frame-src 'self' https://www.google.com https://www.recaptcha.net https://recaptcha.google.com https://www.mercadopago.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          }
        ]
      },
      {
        // CSP mais permissivo para páginas de checkout e APIs
        source: '/(checkout|api/checkout|api/webhooks)/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *",
              "style-src 'self' 'unsafe-inline' *",
              "font-src 'self' *",
              "img-src 'self' data: https: blob: *",
              "connect-src 'self' *",
              "frame-src 'self' *",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' *"
            ].join('; ')
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;