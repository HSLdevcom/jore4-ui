module.exports = {
  target: 'serverless',
  async rewrites() {
    return [
      {
        // Proxy auth api requests to auth backend
        source: '/api/auth/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        // Rewrite everything else to `pages/index`
        source: '/:any*',
        destination: '/',
      },
    ];
  },
  future: {
    // webpack5 support seems to be needed in order to get leaflet running with next
    webpack5: true,
  },
};
