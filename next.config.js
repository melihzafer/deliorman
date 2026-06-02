/** @type {import('next').NextConfig} */

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    qualities: [75, 85, 90],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year for optimal caching
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['swiper', 'framer-motion', 'date-fns', 'yet-another-react-lightbox', 'react-modal-video'],
  },
  // Turbopack configuration (empty to acknowledge and silence warning)
  turbopack: {},
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.mapbox.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://api.mapbox.com https://*.mapbox.com https://*.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://api.mapbox.com https://events.mapbox.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          }
        ],
      },
    ];
  },
  webpack: (config, { isServer, dev, nextRuntime }) => {
    // Edge runtime prohibits eval(); webpack dev mode uses eval by default for source maps.
    // Switch to a non-eval devtool for the edge bundle to avoid EvalError.
    if (dev && nextRuntime === 'edge') {
      config.devtool = false;
    }
    // Handle chunk loading issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));