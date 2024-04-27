import fs from 'fs';
import { parse } from 'csv-parse';
import { Attendance } from '@controllers/attendeeController';
import { Request, Response } from 'express';
import { prisma } from '@configs/prisma';

interface Attendee {
  firstName: string;
  lastName: string;
  name: string;
  orderNumber: string;
  ticketTotal: number;
  discountCode: string;
  ticketCode: string;
  ticketID: string;
  ticketType: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail: string;
  phoneNumber: string;
  companyName: string;
  attendance: string;
}

export const processCSVData = async (filePath: string, eventId: string) => {
  const results: Attendee[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: [
            'firstName',
            'lastName',
            'name',
            'orderNumber',
            'ticketTotal',
            'discountCode',
            'ticketCode',
            'ticketID',
            'ticketType',
            'buyerFirstName',
            'buyerLastName',
            'buyerEmail',
            'phoneNumber',
            'companyName',
          ],
          from_line: 2,
        }),
      )
      .on('data', async (data: any) => {
        try {
          // Extract from CSV data
          const {
            firstName,
            lastName,
            name,
            orderNumber,
            ticketTotal,
            discountCode,
            ticketCode,
            ticketID,
            ticketType,
            buyerFirstName,
            buyerLastName,
            buyerEmail,
            phoneNumber,
            companyName,
            attendance,
          } = data;

          // Store data in database using Prisma
          await prisma.attendee.create({
            data: {
              firstName,
              lastName,
              name,
              orderNumber,
              ticketTotal,
              discountCode,
              ticketCode,
              ticketID,
              ticketType,
              buyerFirstName,
              buyerLastName,
              buyerEmail,
              phoneNumber,
              companyName,
              eventId,
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
    jsonData.forEach(
      (attrecord: {
        id: any;
        firstName: any;
        lastName: any;
        name: any;
        orderNumber: any;
        ticketTotal: any;
        discountCode: any;
        ticketCode: any;
        ticketID: any;
        ticketType: any;
        buyerFirstName: any;
        buyerLastName: any;
        buyerEmail: any;
        phoneNumber: any;
        companyName: any;
      }) => {
        const {
          id,
          firstName,
          lastName,
          name,
          orderNumber,
          ticketTotal,
          discountCode,
          ticketCode,
          ticketID,
          ticketType,
          buyerFirstName,
          buyerLastName,
          buyerEmail,
          phoneNumber,
          companyName,
        } = attrecord;
        Attendance(
          id,
          firstName,
          lastName,
          name,
          orderNumber,
          ticketTotal,
          discountCode,
          ticketCode,
          ticketID,
          ticketType,
          buyerFirstName,
          buyerLastName,
          buyerEmail,
          phoneNumber,
          companyName,
        );
      },
    );
    return res.json({
      message: 'Data has been extracted into CSV file and file is downloaded',
      jsonData: [],
    });
  } catch (error) {
    console.log('Error fetching or processing data:', error);
    return res.status(500).json({ error: 'An error occurred while fetching or processing data' });
  }
};

// Function for handling inserting single manually data into database
export const userService = async (userData: {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  orderNumber: string;
  ticketTotal: string;
  discountCode: string;
  ticketCode: string;
  ticketID: string;
  ticketType: string;
  buyerFirstName: string;
  buyerLastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  eventId: string;
  attendance: string;
}) => {
  try {
    const newUser = await prisma.attendee.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: userData.name,
        orderNumber: userData.orderNumber,
        ticketTotal: userData.ticketTotal,
        discountCode: userData.discountCode,
        ticketCode: userData.ticketCode,
        ticketID: userData.ticketID,
        ticketType: userData.ticketType,
        buyerFirstName: userData.buyerFirstName,
        buyerLastName: userData.buyerLastName,
        buyerEmail: userData.email,
        phoneNumber: userData.phoneNumber,
        companyName: userData.companyName,
        eventId: userData.eventId,
        attendance: userData.attendance,
      },
    });
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

export const updateAttendeesService = async (data: any, id: any) => {
  try {
    await prisma.attendee.update({
      where: {
        id: id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        name: data.name,
        orderNumber: data.orderNumber,
        ticketTotal: data.ticketTotal,
        discountCode: data.discountCode,
        ticketCode: data.ticketCode,
        ticketID: data.ticketID,
        ticketType: data.ticketType,
        buyerFirstName: data.buyerFirstName,
        buyerLastName: data.buyerLastName,
        buyerEmail: data.buyerEmail,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
      },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const sayHello = () => {
  console.log('Hello');
};
