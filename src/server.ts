import { createServer, Server } from 'http';
import { App } from './app';
import { Environments as cfg } from './environments';
import path from 'path';
import fs from 'fs';
import AppDataSource from './config/db.config';
import { Logger } from './config/logger.config';

const application = new App();
const server: Server = createServer(application.app);


const localesPath = path.join(__dirname, '../dist/lang/locales');

if (!fs.existsSync(localesPath)) {
  fs.mkdirSync(localesPath, { recursive: true });
}

/** Graceful shutdown handler */
const gracefulShutdown = async (signal: NodeJS.Signals) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);

  try {
    // Close database connection
    await AppDataSource.destroy();
    Logger().info('Database connection closed.');

    // If you have RabbitMQ or other services, close them here too
    // e.g., await RabbitMQConnection.close();

    server.close(() => {
      Logger().info('HTTP server closed.');
      process.exit(0);
    });

    // Set a timeout to force kill if shutdown hangs
    setTimeout(() => {
      Logger().error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000).unref();

  } catch (error) {
    Logger().error('Error during shutdown:', error);
    process.exit(1);
  }
};


/** Handling unhandled errors */
process.on('unhandledRejection', (reason: any, promise) => {
  Logger().error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err: Error) => {
  Logger().error('Uncaught Exception thrown:', err);
  gracefulShutdown('SIGTERM'); // simulate graceful shutdown
});



/** Handling termination signals */
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
  process.on(signal as NodeJS.Signals, () => gracefulShutdown(signal as NodeJS.Signals));
});
/** Start the server */
server.listen(cfg.AppPort, () => {
  console.log(`Server is running at http://localhost:${cfg.AppPort}`);
});
