import { Router } from 'express';
// import { login } from '../controllers/index';
import { login } from '@controllers/index';

export const loginRouter = Router();

loginRouter.route('/login').post(login);
