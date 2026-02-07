export type ApiErrorCode = 'BAD_REQUEST' | 'UNPROCESSABLE' | 'INTERNAL';

class HttpError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCode;

  constructor(statusCode: number, code: ApiErrorCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export { HttpError };
