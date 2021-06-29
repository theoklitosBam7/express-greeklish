import { Router } from 'express';
import { greeklishRoutes } from './greeklish.routes';

const router = Router();

router.use('/', greeklishRoutes);

export { router };
