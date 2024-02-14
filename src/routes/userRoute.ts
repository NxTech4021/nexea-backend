import { Router } from 'express';
import { getUser } from '../controllers/index';

export const userRouter = Router();

userRouter.route('/user').get(getUser);
