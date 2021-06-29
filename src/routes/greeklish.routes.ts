import { Request, Response, Router } from 'express';
import { greeklishService } from '../services';

const router = Router();

router.get('/greeklish', (req: Request, res: Response) => {
  greeklishService.getText(req, res);
});

export const greeklishRoutes = router;
