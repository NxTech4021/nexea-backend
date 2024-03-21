import { Router } from 'express';

import { attendeesRouter } from './attendeeRoute';
import { authRouter } from './authRoute';

export const routes = Router();

routes.use('/csv', attendeesRouter);
routes.use('/auth', authRouter);
