import { Request, Response } from 'express';
import { processCSVData, updateAttendeesService, userService } from '@services/attendeeServices';
import { appendFileSync } from 'fs';
import multer from 'multer';
import { prisma } from '@configs/prisma';
// import https from 'https';

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (_req: Request, _file: any, cb: any) => {
    cb(null, 'csvuploads/');
  },
  filename: (_req: Request, file: any, cb: any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

// Function to handle file upload and processing
export const uploadAttendees = async (req: Request, res: Response) => {
  const { eventId } = req.body;
  const filePath = (req.files as any)?.file?.tempFilePath;

  try {
    // Check if a file was uploaded
    if (!filePath) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Process CSV data and store in database
    const results = await processCSVData(filePath!, eventId);
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
export const Attendance = (
  id: string,
  firstName: string,
  lastName: string,
  name: string,
  orderNumber: string,
  ticketTotal: string,
  discountCode: string,
  ticketCode: string,
  ticketID: string,
  ticketType: string,
  buyerFirstName: string,
  buyerLastName: string,
  buyerEmail: string,
  phoneNumber: string,
  companyName: string,
) => {
  const csv = `${id},${firstName},${lastName},${name},${orderNumber},${ticketTotal},${discountCode},${ticketCode},${ticketID},${ticketType},${buyerFirstName},${buyerLastName},${buyerEmail},${phoneNumber},${companyName}\n`;
  try {
    appendFileSync('./csvdownloads/attendance.csv', csv);
  } catch (error) {
    console.log(error);
  }
};

// Function for user to store single input data of attendance into database
export const insertUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    const newUser = await userService(userData);
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error' });
  }
};

// eslint-disable-next-line no-unused-vars
export const updateAttendees = async (req: Request, res: Response) => {
  const data = req.body;
  const { id } = req.params;
  try {
    await updateAttendeesService(data, id);

    // Update attendee in Tickera database
    // https.get(`${process.env.TICKERA_API_URL}${attendee?.ticketCode}`, (res) => {
    //   console.log(res.statusCode);
    // });
    res.status(200).json({ message: 'Successfully update' });
  } catch (error) {
    res.status(404).send('Failed');
  }
};

// Get attendee by ticketCode
export const getAttendee = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const attendee = await prisma.attendee.findFirst({
      where: {
        id: id,
      },
    });

    return res.status(200).json(attendee);
  } catch (error) {
    return res.status(200).json(error);
  }
};

export const getAttendeeByEventID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const attendee = await prisma.attendee.findMany({
      where: {
        eventId: id,
      },
    });
    console.log(attendee);
    return res.status(200).json(attendee);
  } catch (error) {
    return res.status(400).json(error);
  }
};
