import express from 'express';
import { uploadAttendees } from '@controllers/attendeeController';

export const attendeesRouter = express.Router();

// Route for file upload
attendeesRouter.post('/upload', uploadAttendees);
