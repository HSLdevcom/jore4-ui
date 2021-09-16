/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

// custom dev server for being able to proxy websocket traffic from
// relative url to local dev server
// based on https://github.com/vercel/next.js/blob/master/examples/with-custom-reverse-proxy/server.js

const express = require('express');
const next = require('next');

const devProxy = {
  // http traffic is proxied through native `next.js` tooling in `next.config.js`
  '/api/hasura': {
    pathRewrite: {
      '^/api/hasura': '', // remove path.
    },
    target: 'http://localhost:8080',
    changeOrigin: true,
    ws: true,
  },
};

const port = parseInt(process.env.PORT, 10) || 3000;
const env = process.env.NODE_ENV;
const dev = env !== 'production';
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
});

const handle = app.getRequestHandler();

let server;
app
  .prepare()
  .then(() => {
    server = express();

    // Set up the proxy.
    if (dev && devProxy) {
      // eslint-disable-next-line global-require
      const { createProxyMiddleware } = require('http-proxy-middleware');
      Object.keys(devProxy).forEach((context) => {
        const proxy = createProxyMiddleware(devProxy[context]);
        server.use(context, proxy);
      });
    }

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port} [${env}]`);
    });
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
