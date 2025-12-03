/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
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
        // CSP específico para o Sanity Studio
        source: '/studio/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com https://1sbzjovr.api.sanity.io https://cdn.sanity.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://core.sanity-cdn.com",
              "font-src 'self' https://fonts.gstatic.com https://core.sanity-cdn.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://1sbzjovr.api.sanity.io https://api.sanity.io https://core.sanity-cdn.com https://cdn.sanity.io",
              "frame-src 'self' https://1sbzjovr.api.sanity.io https://api.sanity.io",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          }
        ]
      },
      {
        // Aplicar CSP apenas nas páginas que não são de checkout/pagamento ou studio
        source: '/((?!checkout|api/checkout|api/webhooks|studio).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.recaptcha.net https://www.gstatic.com https://sdk.mercadopago.com https://www.mercadopago.com https://www.clarity.ms",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob: https://www.clarity.ms",
              "connect-src 'self' https://api.mercadopago.com https://www.google.com https://www.recaptcha.net https://1sbzjovr.api.sanity.io https://api.sanity.io https://cdn.sanity.io https://www.clarity.ms",
              "frame-src 'self' https://www.google.com https://www.recaptcha.net https://recaptcha.google.com https://www.mercadopago.com",
              "worker-src 'self' blob:",
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://sdk.mercadopago.com https://www.mercadopago.com https://www.clarity.ms",
              "child-src 'self'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' blob: data: https://cdn.sanity.io https://images.unsplash.com https://powerhousebrasil.com.br",
              "connect-src 'self' https://api.mercadopago.com https://www.google.com https://1sbzjovr.api.sanity.io https://api.sanity.io https://cdn.sanity.io https://www.clarity.ms",
              "worker-src 'self' blob:",
              "frame-src 'self' https://www.google.com https://www.mercadopago.com"
            ].join('; ')
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;
