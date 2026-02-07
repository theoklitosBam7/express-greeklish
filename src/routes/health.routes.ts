import { Request, Response, Router } from 'express';
import { greeklishService } from '../services';
import { HealthResponse, ReadyzResponse } from '../types/api.types';

const router = Router();

const handleHealthz = (_req: Request, res: Response<HealthResponse>) => {
  res.status(200).json({ status: 'ok' });
};

const handleReadyz = (_req: Request, res: Response<ReadyzResponse>) => {
  const readiness = greeklishService.getReadyState();

  if (readiness.ready) {
    res.status(200).json({
      status: 'ready',
      dictionaryLoadCount: readiness.dictionaryLoadCount,
      error: null,
    });
    return;
  }

  res.status(503).json({
    status: 'not_ready',
    dictionaryLoadCount: readiness.dictionaryLoadCount,
    error: readiness.error,
  });
};

router.get('/healthz', handleHealthz);
router.get('/readyz', handleReadyz);

const healthRoutes = router;

export { handleHealthz, handleReadyz, healthRoutes };
