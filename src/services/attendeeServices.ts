import fs from 'fs';
import csvParser from 'csv-parser';
import { prisma } from '@configs/prisma'; 

interface Attendee {
    name: string;
    email: string;
    attendance: string;
}

// Function to process CSV data and store in the database
export const processCSVData = async (filePath: string) => {
  const results: Attendee[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser(['name', 'email', 'attendance']))
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
            }
          })
          results.push(data);
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
