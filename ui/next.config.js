/** @type {import('next').NextConfig} */
module.exports = {
  compress: false, // We have server rendering disabled so can't use compression.
  async rewrites() {
    return [
      {
        // Rewrite everything to `pages/index`
        source: '/:any*',
        destination: '/',
      },
    ];
  },
  output: 'export',
  productionBrowserSourceMaps: true,

  // We only have the 1 dynamic / route.
  // No need to shows a Next.js navigation menu.
  devIndicators: false,
};
