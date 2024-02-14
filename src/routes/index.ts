import { Router } from 'express';
import { userRouter } from './userRoute';

export const routes = Router();

routes.use(userRouter);
