// custom dev server for being able to proxy websocket traffic from
// relative url to local dev server
// based on https://github.com/vercel/next.js/blob/master/examples/with-custom-reverse-proxy/server.js

// Note: in NodeJS 17 the DNS lookup logic has changed (https://github.com/nodejs/node/issues/40702#issuecomment-1103623246)
// Now it doesn't use the default 127.0.0.1 but uses the entries from /etc/hosts, including the IPv6 ::1 entry. This breaks all http
// requests done in NodeJS. Have to explicitly use 127.0.0.1 for now, before all services are prepared to use IPv6.

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const next = require('next');

function getApiProtocol(req) {
  if (req.url.startsWith('ws')) {
    return 'ws:';
  }

  return 'http:';
}

function getApiPort(req) {
  if (req.headers['x-environment'] === 'e2e') {
    return 3211;
  }

  return 3201;
}

const devProxy = {
  '/api/graphql': {
    pathRewrite: {
      '^/api/graphql': '', // remove path.
    },
    router: (req) => {
      const protocol = getApiProtocol(req);
      const port = getApiPort(req);
      return { protocol, port, host: '127.0.0.1' };
    },
    changeOrigin: true,
    // This does not seem to play well with nextJS.
    // Besides it was already broken earlier, but now it also breaks
    // and conflicts with Hot reloading if enabled.
    ws: false,
  },
  '/api/auth': {
    // Proxy auth api requests to auth backend
    pathRewrite: {
      '^/api/auth': '', // remove path.
    },
    target: 'http://127.0.0.1:3200',
  },
  '/api/mbtiles': {
    // Proxy mbtiles requests to mbtiles server
    pathRewrite: {
      '^/api/mbtiles': '', // remove path.
    },
    target: 'http://127.0.0.1:3203',
  },
  '/api/mapmatching': {
    // Proxy map routing requests to routing service
    pathRewrite: {
      '^/api/mapmatching': '', // remove path.
    },
    target: 'http://127.0.0.1:3005',
  },
  '/api/hastus': {
    // Proxy hastus importer / exporter requests to hastus import / export microservice
    pathRewrite: {
      '^/api/hastus': '', // remove path.
    },
    target: 'http://127.0.0.1:3008',
  },
};

const port = parseInt(process.env.PORT, 10) || 3300;
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev: true,
});

let server;
app
  .prepare()
  .then(() => {
    server = express();

    const wsProxies = {};
    // Set up the proxy.
    Object.entries(devProxy).forEach(([path, options]) => {
      const proxy = createProxyMiddleware({
        logger: console,
        ...options,
      });

      server.use(path, proxy);

      if (options.ws) {
        wsProxies[path] = proxy;
      }
    });

    // Default catch-all handler to allow Next.js to handle all other routes
    const nextRequestHandler = app.getRequestHandler();
    server.all('/{*splat}', (req, res) => nextRequestHandler(req, res));

    const httpServer = server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port}`);
    });

    const nextUpgradeHandler = app.getUpgradeHandler();
    httpServer.on('upgrade', (req, proxy, head) => {
      for (const [path, hpm] of Object.entries(wsProxies)) {
        if (req.url.includes(path)) {
          return hpm.upgrade(req, proxy, head);
        }
      }

      return nextUpgradeHandler(req, proxy, head);
    });
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
