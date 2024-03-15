import { Request, Response } from 'express';
import { processCSVData } from '@services/attendeeServices';
import { appendFileSync } from 'fs';

// Function to handle file upload and processing
export const uploadAttendees = async (req: Request, res: Response) => {
  const filePath = req.file?.path;

  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Process CSV data and store in database
    const results = await processCSVData(filePath!);
    return res.json({
      message: 'CSV data has been processed and stored in the database',
      results,
    });
  } catch (error) {
    console.error('An error occurred while uploading and processing CSV file:', error);
    return res.status(500).json({ error: 'An error occurred while processing CSV file' });
  }
};

// Function to store into CSV
export const Attendance = (id: any, name: any, email: any, attendance: any) => {
  const csv = `${id},${name},${email},${attendance}\n`;
  try {
    appendFileSync('./csvdownloads/attendance.csv', csv);
  } catch (error) {
    console.log(error);
  }
};
