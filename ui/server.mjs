import express from 'express';
import next from 'next';

const port = parseInt(process.env.PORT, 10) || 3300;
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev: true,
});

app
  .prepare()
  .then(() => {
    const server = express();

    // Default catch-all handler to allow Next.js to handle all other routes
    const nextRequestHandler = app.getRequestHandler();
    server.all('/{*splat}', (req, res) => nextRequestHandler(req, res));

    const httpServer = server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port}`);
    });

    httpServer.on('upgrade', app.getUpgradeHandler());
  })
  .catch((err) => {
    console.error('An error occurred, unable to start the server');
    console.error(err);
  });
