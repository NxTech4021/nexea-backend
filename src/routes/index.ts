import { Router } from 'express';

//import { userRouter } from './userRoute';
import { attendeesRouter } from './attendeeRoute';
import { loginRouter } from './loginRoute';
import { passwordRouter } from './passwordRoute';

export const routes = Router();

routes.use('/csv', attendeesRouter);
routes.use('/password', passwordRouter);
//routes.use('/user', userRouter);
routes.use('/auth', loginRouter);
