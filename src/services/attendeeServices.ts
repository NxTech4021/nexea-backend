import fs from 'fs';
import csvParser from 'csv-parser';
import { prisma } from '@configs/prisma';
import { Attendance } from '@controllers/attendeeController';
import { Request, Response } from 'express';

interface Attendee {
    name: string;
    email: string;
    attendance: string;
}

export const processCSVData = async (filePath: string) => {
  const results: Attendee[] = [];
  let isFirstLine = true; // Flag to track if it's the first line
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser(['name', 'email', 'attendance']))
      .on('data', async (data) => {
        try {
          if (!isFirstLine) { // Skip the first line
            // Extract from CSV data
            const { name, email, attendance } = data;
            // Store data in database using Prisma
            await prisma.attendee.create({
              data: {
                name,
                email,
                attendance,
              }
            })
            results.push(data);
          }
          isFirstLine = false; // Set the flag to false after processing the first line
        } catch (error) {
          console.error('Error processing CSV data:', error);
        }
      })
      .on('end', () => {
        fs.unlinkSync(filePath);
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Fetch JSON data with prisma and directly process it
export const extractCSVData = async (_req: Request, res: Response) => {
  try {
    var jsonData = await prisma.attendee.findMany();
    jsonData.forEach((attrecord: { id: any; name: any; email: any; attendance: any; }) => {
      const { id, name, email, attendance } = attrecord;
      Attendance(id, name, email, attendance);
    });
    return res.json({
      message: 'Data has been extracted into CSV file and file is downloaded',
      jsonData: []
    });
  } catch (error) {
    console.log('Error fetching or processing data:', error);
    return res.status(500).json({ error: 'An error occurred while fetching or processing data' });
  }
};

