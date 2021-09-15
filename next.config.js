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
        // Proxy mbtiles requests to mbtiles server
        source: '/api/mbtiles/:path*',
        destination: 'http://localhost:3200/:path*',
      },
      {
        // Proxy martin requests to martin
        source: '/api/martin/:path*',
        destination: 'http://localhost:3100/:path*',
      },
      {
        // Rewrite everything else to `pages/index`
        source: '/:any*',
        destination: '/',
      },
    ];
  },
};
