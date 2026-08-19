/** @type {import('next').NextConfig} */
module.exports = {
  compress: false, // We have server rendering disabled so can't use compression.
  rewrites: () => [
    {
      source: '/api/graphql/:path*',
      destination: 'http://127.0.0.1:3211/:path*',
      has: [{ type: 'header', key: 'x-environment', value: 'e2e' }],
    },
    {
      source: '/api/graphql/:path*',
      destination: 'http://127.0.0.1:3201/:path*',
    },
    {
      source: '/api/auth/:path*',
      destination: 'http://127.0.0.1:3200/:path*',
    },
    {
      source: '/api/mbtiles/:path*',
      destination: 'http://127.0.0.1:3203/:path*',
    },
    {
      source: '/api/mapmatching/:path*',
      destination: 'http://127.0.0.1:3005/:path*',
    },
    {
      source: '/api/hastus/:path*',
      destination: 'http://127.0.0.1:3008/:path*',
    },
    {
      // Rewrite everything to `pages/index`
      source: '/:any*',
      destination: '/',
    },
  ],
  output: 'export',
  productionBrowserSourceMaps: true,

  // We only have the 1 dynamic / route.
  // No need to shows a Next.js navigation menu.
  devIndicators: false,
};
