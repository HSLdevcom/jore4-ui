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
        source: '/api/graphql/:path*',
        destination: 'http://localhost:8080/:path*',
      },
      {
        // Proxy mbtiles requests to mbtiles server
        source: '/api/mbtiles/:path*',
        destination: 'http://localhost:3300/:path*',
      },
      {
        // Proxy martin requests to martin
        source: '/api/martin/:path*',
        destination: 'http://localhost:3100/:path*',
      },
      {
        // Proxy map routing requests to routing service
        source: '/api/route/v1/:path*',
        destination: 'http://localhost:3200/api/route/v1/:path*',
      },
      {
        // Rewrite everything else to `pages/index`
        source: '/:any*',
        destination: '/',
      },
    ];
  },
  webpack: (config) => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': 'maplibre-gl',
    };
    return config;
  },
};
