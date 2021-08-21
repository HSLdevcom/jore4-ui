/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

// `next-images` is needed in order to be able to import image files to our
// src files.
const withImages = require('next-images');

module.exports = withImages({
  target: 'serverless',
  ...(process.env.NEXT_PUBLIC_ENABLE_PROXY && {
    async rewrites() {
      return [
        {
          // Proxy auth api requests to auth backend
          source: '/api/auth/:path*',
          destination: 'http://localhost:3001/api/:path*',
        },
        {
          // Proxy graphql requests to hasura
          source: '/api/graphql/:path*',
          destination: 'http://localhost:8080/:path*',
        },
        {
          // Rewrite everything else to `pages/index`
          source: '/:any*',
          destination: '/',
        },
      ];
    },
  }),
  future: {
    // webpack5 support seems to be needed in order to get leaflet running with next
    webpack5: true,
  },
});
