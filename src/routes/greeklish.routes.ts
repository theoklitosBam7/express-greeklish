import { Request, Response, Router } from 'express';

const router = Router();

router.get('/greeklish', (req: Request, res: Response) => {
  console.log('/greeklish works!');

  res.send({
    works: '/greeklish works!',
  });
});

export const greeklishRoutes = router;
