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
        // Proxy graphql requests to hasura
        source: '/api/hasura/:path*',
        destination: 'http://localhost:8080/:path*',
      },
      {
        // Rewrite everything else to `pages/index`
        source: '/:any*',
        destination: '/',
      },
    ];
  },
};
