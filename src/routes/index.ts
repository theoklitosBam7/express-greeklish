import { Router } from 'express';
import { greeklishRoutes } from './greeklish.routes';
import { v1Routes } from './v1.routes';

const router = Router();

router.use('/', greeklishRoutes);
router.use('/v1', v1Routes);

export { router };
