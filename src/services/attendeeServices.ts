import fs from 'fs';
import { parse } from 'csv-parse';
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
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({
        columns: ['name', 'email', 'attendance'],
        from_line: 2,
      }))
      .on('data', async (data) => {
        try {
            // Extract from CSV data
            const { name, email, attendance } = data;
            // Store data in database using Prisma
            await prisma.attendee.create({
              data: {
                name,
                email,
                attendance,
              },
            });
            results.push(data);
        } catch (error) {
          console.error('Error processing CSV data:', error);
        }
      })
      .on('end', () => {
        fs.unlinkSync(filePath);
        resolve(results);
      })
      .on('error', (error: any) => {
        reject(error);
      });
  });
};

// Fetch JSON data with prisma and directly process it
export const extractCSVData = async (_req: Request, res: Response) => {
  try {
    const jsonData = await prisma.attendee.findMany();
    jsonData.forEach((attrecord: { id: any; name: any; email: any; attendance: any }) => {
      const { id, name, email, attendance } = attrecord;
      Attendance(id, name, email, attendance);
    });
    return res.json({
      message: 'Data has been extracted into CSV file and file is downloaded',
      jsonData: [],
    });
  } catch (error) {
    console.log('Error fetching or processing data:', error);
    return res.status(500).json({ error: 'An error occurred while fetching or processing data' });
  }
};
