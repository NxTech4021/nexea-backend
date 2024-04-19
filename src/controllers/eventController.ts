import { Request, Response } from 'express';
import { prisma } from '@configs/prisma';

export const createEvent = async (req: Request, res: Response) => {
  try {
    // Extract data from request body
    const { name, personInCharge, description, tickera_api, date } = req.body;

    const event = await prisma.event.create({
      data: {
        name,
        personInCharge: { connect: { id: personInCharge } },
        description,
        tickera_api,
        date,
        status: 'scheduled',
      },
    });

    // Return success response with the created event and event ID
    res.status(201).json({ success: true, event, eventId: event.id });
  } catch (error) {
    // Handle errors
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    // Extract data from request body
    const { name, personInCharge, description, tickera_api, date, status } = req.body;
    const { id } = req.params; // Extract the event ID from the request parameters

    // Update the event in the database
    const updatedEvent = await prisma.event.update({
      where: { id: String(id) }, // Ensure the ID is treated as a number
      data: {
        name,
        personInCharge: { connect: { id: String(personInCharge) } }, // Connect to the personInCharge by ID
        description,
        tickera_api,
        date,
        status,
      },
    });

    // Return success response with the updated event
    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    // Handle errors
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        personInCharge: true, // Include the personInCharge relation
      },
    });
    // Return success response with the fetched events
    res.status(200).json({ success: true, events });
  } catch (error) {
    // Handle errors
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
