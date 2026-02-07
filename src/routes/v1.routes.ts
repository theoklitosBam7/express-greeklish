import { Request, Response, Router } from 'express';
import { greeklishService } from '../services';
import { ConvertResponse } from '../types/api.types';
import { validateText } from '../validators/text.validator';

type ConvertRequestBody = {
  text?: unknown;
};

const router = Router();

const handleV1Convert = (
  req: Request<object, object, ConvertRequestBody>,
  res: Response<ConvertResponse>
) => {
  const requestId = res.locals.requestId ?? 'unknown';
  const requestStart = process.hrtime.bigint();
  const text = validateText(req.body?.text);
  const result = greeklishService.convert(text);
  const elapsedMs = Number(process.hrtime.bigint() - requestStart) / 1_000_000;

  res.status(200).json({
    input: text,
    output: result.output,
    corrected: result.corrected,
    tokens: result.tokens,
    warnings: result.warnings,
    meta: {
      elapsedMs: Number(elapsedMs.toFixed(2)),
      requestId,
    },
  });
};

router.post('/convert', handleV1Convert);

const v1Routes = router;

export { v1Routes, handleV1Convert };
