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
  eslint: {
    // Don't run eslint as part of builds.
    // We have separate CI job to run it, so it is not useful to run it
    // as part of builds. (It also seems like `next lint` command does not
    // respect our eslint config defined in `.eslintrc.js`.)
    ignoreDuringBuilds: true,
  },
  output: 'export',
};
