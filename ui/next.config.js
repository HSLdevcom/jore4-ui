module.exports = {
  async rewrites() {
    return [
      {
        // Rewrite everything to `pages/index`
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
