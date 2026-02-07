import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error';
import { ErrorResponse } from '../types/api.types';

const createErrorBody = (
  requestId: string,
  code: HttpError['code'],
  message: string
): ErrorResponse => ({
  error: {
    code,
    message,
    requestId,
  },
});

const notFoundHandler = (req: Request, res: Response): void => {
  const requestId = res.locals.requestId ?? 'unknown';
  res.status(404).json(createErrorBody(requestId, 'BAD_REQUEST', `Route "${req.path}" was not found.`));
};

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const requestId = res.locals.requestId ?? 'unknown';

  if (err instanceof HttpError) {
    res.status(err.statusCode).json(createErrorBody(requestId, err.code, err.message));
    return;
  }

  const message = err instanceof Error ? err.message : 'Unknown internal error';
  console.error('Unhandled request error', { requestId, message });
  res.status(500).json(createErrorBody(requestId, 'INTERNAL', 'Unexpected server error.'));
};

export { errorHandler, notFoundHandler };
