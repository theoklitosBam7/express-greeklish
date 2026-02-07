import { ApiErrorCode } from '../errors/http-error';
import { TokenResult } from '../services/greeklish.service';

export type ConvertResponse = {
  input: string;
  output: string;
  corrected: boolean;
  tokens: TokenResult[];
  warnings: string[];
  meta: {
    elapsedMs: number;
    requestId: string;
  };
};

export type LegacyConvertResponse = {
  greek: string;
};

export type HealthResponse = {
  status: 'ok';
};

export type ReadyzResponse = {
  status: 'ready' | 'not_ready';
  dictionaryLoadCount: number;
  error: string | null;
};

export type ErrorResponse = {
  error: {
    code: ApiErrorCode;
    message: string;
    requestId: string;
  };
};
