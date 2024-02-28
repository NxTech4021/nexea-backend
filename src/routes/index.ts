import { Router } from 'express';

import { userRouter } from './userRoute';
import { loginRouter } from './loginRoute';
import { passwordRouter } from './passwordRoute';


export const routes = Router();


routes.use('/password', passwordRouter)
routes.use('/user' , userRouter);
routes.use('/auth', loginRouter);
