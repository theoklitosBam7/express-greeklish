import { HttpError } from '@/errors/http-error';

const MAX_TEXT_LENGTH = 5000;

const validateText = (value: unknown): string => {
  if (typeof value === 'undefined') {
    throw new HttpError(400, 'BAD_REQUEST', '"text" is required.');
  }

  if (typeof value !== 'string') {
    throw new HttpError(400, 'BAD_REQUEST', '"text" must be a string.');
  }

  const text = value.trim();

  if (!text) {
    throw new HttpError(400, 'BAD_REQUEST', '"text" cannot be empty.');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new HttpError(
      422,
      'UNPROCESSABLE',
      `"text" is too long. Maximum allowed length is ${MAX_TEXT_LENGTH} characters.`
    );
  }

  return text;
};

export { MAX_TEXT_LENGTH, validateText };
