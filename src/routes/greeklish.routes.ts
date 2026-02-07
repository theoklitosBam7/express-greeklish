import { greeklishService } from '@/services';
import { LegacyConvertResponse } from '@/types/api.types';
import { validateText } from '@/validators/text.validator';
import { Request, Response, Router } from 'express';

const router = Router();

const handleLegacyConvert = (req: Request, res: Response<LegacyConvertResponse>) => {
  const text = validateText(req.query.text);
  const result = greeklishService.convert(text);

  res.status(200).json({
    greek: result.output,
  });
};

router.get('/greeklish', handleLegacyConvert);

const greeklishRoutes = router;

export { greeklishRoutes, handleLegacyConvert };
