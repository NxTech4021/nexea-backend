import { Router } from 'express';

import { authRouter } from './authRoute';
import { userRouter } from './userRoute';
import { eventRouter } from './eventRoute';
import { attendeesRouter } from './attendeeRoute';

export const routes = Router();

routes.use('/attendee', attendeesRouter);
routes.use('/auth', authRouter);
routes.use('/user', userRouter);
routes.use('/event', eventRouter);
