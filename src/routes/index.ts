import { Router } from 'express';
import { userRouter } from './userRoute';
import { loginRouter } from './loginRoute';

export const routes = Router();

routes.use('/user', userRouter);
routes.use('/auth', loginRouter);
