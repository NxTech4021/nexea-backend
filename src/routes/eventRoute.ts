import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  updateEventStatus,
  sendingText,
  sendingImg,
  sendingLocation,
} from '@controllers/eventController';
import isAdmin from '@middlewares/isAdmin';
import { Router } from 'express';

export const eventRouter = Router();

eventRouter.route('/create').post(createEvent);
eventRouter.route('/events').get(getAllEvents);
eventRouter.route('/delete/:id').delete(isAdmin, deleteEvent);
eventRouter.route('/update/:id').put(updateEvent);
eventRouter.route('/status/:id').put(updateEventStatus);
eventRouter.route('/:id').get(getEvent);
eventRouter.route('/sendtext').post(sendingText);
eventRouter.route('/sendimage').post(sendingImg);
eventRouter.route('/sendlocation').post(sendingLocation);
