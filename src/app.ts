import { errorHandler, notFoundHandler } from '@/middleware/error-handler.middleware';
import { attachRequestContext, requestLogger } from '@/middleware/request-context.middleware';
import { router } from '@/routes';
import { healthRoutes } from '@/routes/health.routes';
import express, { NextFunction, Request, Response } from 'express';
import path from 'node:path';

type CreateAppOptions = {
  staticRoot?: string;
};

const createApp = (options: CreateAppOptions = {}) => {
  const app = express();

  app.use(express.json({ limit: '64kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(attachRequestContext);
  app.use(requestLogger);

  app.use('/', healthRoutes);
  app.use('/api', router);

  if (options.staticRoot) {
    app.use(express.static(options.staticRoot));
    app.get('/{*splat}', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api') || req.path === '/healthz' || req.path === '/readyz') {
        next();
        return;
      }

      res.sendFile(path.resolve(options.staticRoot as string, 'index.html'), (error: Error | undefined) => {
        if (error) {
          next();
        }
      });
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export { createApp };
