import express from 'express';
import {
  getAttendee,
  getAttendeeByEventID,
  insertUser,
  updateAttendees,
  uploadAttendees,
} from '@controllers/attendeeController';
import { extractCSVData } from '@services/attendeeServices';

import { prisma } from '@configs/prisma';
// import { upload } from '@controllers/attendeeController';

export const attendeesRouter = express.Router();

attendeesRouter.route('/:id').get(getAttendee);

attendeesRouter.route('/event/:id').get(getAttendeeByEventID);

// Extract data into CSV
attendeesRouter.get('/download', extractCSVData);

attendeesRouter.route('/delete').delete(async (_req, res) => {
  try {
    const a = await prisma.attendee.deleteMany();
    return res.status(200).json(a);
  } catch (error) {
    return res.status(400).send('ERROR DELETE');
  }
});

// eslint-disable-next-line no-unused-vars
attendeesRouter.post('/upload', uploadAttendees);

// Handle single inserted data
attendeesRouter.post('/create', insertUser);

// Update
attendeesRouter.patch('/update/:id', updateAttendees);
