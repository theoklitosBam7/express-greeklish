import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

const attachRequestContext = (req: Request, res: Response, next: NextFunction): void => {
  const incomingId = req.header('x-request-id');
  const requestId = typeof incomingId === 'string' && incomingId.trim() ? incomingId : randomUUID();

  res.locals.requestId = requestId;
  res.locals.startedAtNs = process.hrtime.bigint();
  res.setHeader('x-request-id', requestId);

  next();
};

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (process.env.DISABLE_REQUEST_LOGS === '1') {
    next();
    return;
  }

  res.on('finish', () => {
    const startedAtNs = res.locals.startedAtNs ?? process.hrtime.bigint();
    const elapsedMs = Number(process.hrtime.bigint() - startedAtNs) / 1_000_000;

    console.info(
      JSON.stringify({
        requestId: res.locals.requestId ?? 'unknown',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        elapsedMs: Number(elapsedMs.toFixed(2)),
      })
    );
  });

  next();
};

export { attachRequestContext, requestLogger };
