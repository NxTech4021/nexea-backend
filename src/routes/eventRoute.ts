import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from '@controllers/eventController';
import { Router } from 'express';

export const eventRouter = Router();

eventRouter.route('/create').post(createEvent);
eventRouter.route('/events').get(getAllEvents);
eventRouter.route('/delete/:id').delete(deleteEvent);
eventRouter.route('/update/:id').put(updateEvent);
eventRouter.route('/:id').get(getEvent);
