import express from 'express';
import { insertUser, uploadAttendees } from '@controllers/attendeeController';
import { extractCSVData } from '@services/attendeeServices';
import { upload } from '@controllers/attendeeController';

export const attendeesRouter = express.Router();

// Upload CSV to store data
attendeesRouter.post('/upload', upload.single('file'), uploadAttendees);

// Extract data into CSV
attendeesRouter.get('/download', extractCSVData);

// Handle single inserted data
attendeesRouter.post('/create', insertUser);
