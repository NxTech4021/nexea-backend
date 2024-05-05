//@ts-nocheck

import fs from 'fs';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
// import { Attendance } from '@controllers/attendeeController';
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
  // attendance: string;
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
            'email',
            'orderNumber',
            'ticketTotal',
            'discountCode',
            'ticketCode',
            'ticketID',
            'ticketType',
            'buyerFirstName',
            'buyerLastName',
            'buyerName',
            'buyerEmail',
            'checkedIn',
            'price',
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
            email,
            orderNumber,
            ticketTotal,
            discountCode,
            ticketCode,
            ticketID,
            ticketType,
            buyerFirstName,
            buyerLastName,
            buyerEmail,
            buyerName,
            phoneNumber,
            companyName,
            checkedIn,
          } = data;

          // Store data in database using Prisma
          await prisma.attendee.create({
            data: {
              firstName,
              lastName,
              name,
              email,
              orderNumber,
              ticketTotal,
              discountCode,
              ticketCode,
              ticketID,
              ticketType,
              buyerFirstName,
              buyerLastName,
              buyerName,
              buyerEmail,
              phoneNumber,
              companyName,
              eventId,
              checkedIn,
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
export const extractCSVData = async (req: Request, res: Response) => {
  const eventId = req.query.eventId as string;
  try {
    // Fetch only the attendee data related to the selected event
    const jsonData = await prisma.attendee.findMany({
      where: {
        eventId: eventId,
      },
    });

    // Set the filename of the downloaded CSV file to the name of the selected event
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventName = event.name;

    const csvData = jsonData.map((attrecord) => {
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
      return [
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
      ];
    });

    const columnHeaders = [
      'id',
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
      'attendance',
    ];

    // Prepend the column headers to the csvData array
    csvData.unshift(columnHeaders);

    // Set headers for CSV file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${eventName}.csv"`);

    // Convert CSV data to string and send it as the response
    stringify(csvData, (err, output) => {
      if (err) {
        console.error('Error converting CSV data:', err);
        return res.status(500).json({ error: 'An error occurred while converting CSV data' });
      }
      res.status(200).send(output);
    });
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).json({ error: 'An error occurred while fetching or processing data' });
  }
};

// Function for handling inserting single manually data into database
export const userService = async (userData: {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  orderNumber: string;
  email: string,
  ticketTotal: string;
  discountCode: string;
  ticketCode: string;
  ticketID: string;
  ticketType: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerName: string;
  buyerEmail: string;
  phoneNumber: string;
  companyName: string;
  eventId: string;
  checkedIn: 'No'
  // attendance: string;
}) => {
  try {
    const newUser = await prisma.attendee.create({
      data: {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: userData.name,
        orderNumber: userData.orderNumber,
        email: userData.email,
        ticketTotal: userData.ticketTotal,
        discountCode: userData.discountCode,
        ticketCode: userData.ticketCode,
        ticketID: userData.ticketID,
        ticketType: userData.ticketType,
        buyerFirstName: userData.buyerFirstName,
        buyerLastName: userData.buyerLastName,
        buyerName: userData.buyerName,
        buyerEmail: userData.buyerEmail,
        phoneNumber: userData.phoneNumber,
        companyName: userData.companyName,
        checkedIn: userData.checkedIn,
        eventId: userData.eventId,
      },
    });
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(`Error creating user: ${error}`);
  }
};

export const updateAttendeesService = async (data: any, id: any) => {
  const {
    firstName,
    lastName,
    name,
    email,
    orderNumber,
    ticketTotal,
    discountCode,
    ticketCode,
    ticketID,
    ticketType,
    buyerFirstName,
    buyerLastName,
    buyerEmail,
    buyerName,
    phoneNumber,
    companyName,
    checkedIn,
  } = data;

  try {
    await prisma.attendee.update({
      where: {
        id: id,
      },
      data: {
        firstName,
        lastName,
        name,
        email,
        orderNumber,
        ticketTotal,
        discountCode,
        ticketCode,
        ticketID,
        ticketType,
        buyerFirstName,
        buyerLastName,
        buyerEmail,
        buyerName,
        phoneNumber,
        companyName,
        checkedIn,
      },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};
