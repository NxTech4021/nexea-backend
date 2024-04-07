import { updateInfo} from '@controllers/userController';
import { Router } from 'express';

export const userRouter = Router();

userRouter.get('/', (req, res) => {
  const a = req.headers['cookie'];
  res.send(a);
});


userRouter.patch('/update/:id', updateInfo);
