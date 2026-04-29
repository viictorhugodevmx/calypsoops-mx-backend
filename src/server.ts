import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`CalypsoOps MX API running on port ${env.port}`);
    console.log(`Health check: http://localhost:${env.port}/api/health`);
  });
};

startServer();