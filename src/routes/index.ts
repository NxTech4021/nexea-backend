import { Router } from 'express';

import { attendeesRouter } from './attendeeRoute';
import { authRouter } from './authRoute';
import { userRoute } from './userRoute';

export const routes = Router();

routes.use('/attendee', attendeesRouter);
routes.use('/auth', authRouter);
routes.use('/user', userRoute);
