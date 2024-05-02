import express from 'express';
import { getAttendee, insertUser, updateAttendees, uploadAttendees } from '@controllers/attendeeController';
import { extractCSVData } from '@services/attendeeServices';
import { prisma } from '@configs/prisma';
// import { upload } from '@controllers/attendeeController';

export const attendeesRouter = express.Router();

attendeesRouter.get('/:id', getAttendee);

// eslint-disable-next-line no-unused-vars
attendeesRouter.post('/upload', uploadAttendees);

// Extract data into CSV
attendeesRouter.get('/download', extractCSVData);

// Handle single inserted data
attendeesRouter.post('/create', insertUser);

// Update
attendeesRouter.patch('/update/:id', updateAttendees);

attendeesRouter.get('/delete', async (_req, res) => {
  try {
    await prisma.attendee.deleteMany();
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send('ERROR DELETE');
  }
});
