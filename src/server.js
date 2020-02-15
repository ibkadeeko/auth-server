import http from 'http';
import Debug from 'debug';
import cluster from 'cluster';

import config from './config';
import app from './loaders/express.loader';
import connect from './loaders/mongoose.loader';
import setupWorkerProcesses from './loaders/cluster.loader';

const debug = Debug('api:server:');

const isDevelopment = config.env === 'development';

app.set('port', config.port);
const server = http.createServer(app);

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind =
    typeof config.port === 'string'
      ? 'Pipe ' + config.port
      : 'Port ' + config.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

async function startServer() {
  try {
    await connect(config.databaseURL);
    server.listen(config.port);
    server.on('error', onError);
    server.on('listening', onListening);
  } catch (error) {
    debug(error);
  }
}

/**
 * Setup server either with clustering or without it
 * @param {Boolean} isClusterRequired
 *
 * @returns {void}
 */
const setupServer = isClusterRequired => {
  // if it is a master process then call setting up worker process
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses(cluster);
  } else {
    // to setup server configurations and share port address for incoming requests
    startServer();
  }
};

setupServer(!isDevelopment);
