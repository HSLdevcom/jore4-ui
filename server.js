/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

// custom dev server for being able to proxy websocket traffic from
// relative url to local dev server
// based on https://github.com/vercel/next.js/blob/master/examples/with-custom-reverse-proxy/server.js

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const next = require('next');

const devProxy = {
  '/api/graphql': {
    pathRewrite: {
      '^/api/graphql': '', // remove path.
    },
    target: 'http://localhost:3201',
    changeOrigin: true,
    ws: true,
  },
  '/api/auth': {
    // Proxy auth api requests to auth backend
    pathRewrite: {
      '^/api/auth': '', // remove path.
    },
    target: 'http://localhost:3200',
  },
  '/api/mbtiles': {
    // Proxy mbtiles requests to mbtiles server
    pathRewrite: {
      '^/api/mbtiles': '', // remove path.
    },
    target: 'http://localhost:3203',
  },
  '/api/martin': {
    // Proxy martin requests to martin
    pathRewrite: {
      '^/api/martin': '', // remove path.
    },
    target: 'http://localhost:3100',
  },
  '/api/mapmatching': {
    // Proxy map routing requests to routing service
    pathRewrite: {
      '^/api/mapmatching': '', // remove path.
    },
    target: 'http://localhost:3005',
  },
};

const port = parseInt(process.env.PORT, 10) || 3300;
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev: true,
});

const requestHandler = app.getRequestHandler();

let server;
app
  .prepare()
  .then(() => {
    server = express();

    // Set up the proxy.
    Object.keys(devProxy).forEach((key) => {
      const proxy = createProxyMiddleware(devProxy[key]);
      server.use(key, proxy);
    });

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => requestHandler(req, res));

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
