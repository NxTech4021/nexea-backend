import { Request, Response } from 'express';
import { prisma } from '@configs/prisma';
import cron from 'node-cron';
import { EventStatus } from '@prisma/client';
// Get event by ID

export const getEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });

    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json(error);
  }
};

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

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params; // Extract the event ID from the request parameters

  try {
    // Delete the event from the database
    await prisma.event.delete({
      where: {
        id: String(id),
      },
    });

    // Return success response
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        personInCharge: true, // Include the personInCharge relation
        attendees: true,
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

export const updateEventStatus = () => {
  try {
    const cronSchedule = '0 0 * * *'; // run every 24 hour

    const job = cron.schedule(cronSchedule, async () => {
      try {
        const currentDate = new Date();
        const eventsToUpdate = await prisma.event.findMany();

        await Promise.all(
          eventsToUpdate.map(async (event) => {
            const evDate = new Date(event.date);
            evDate.setHours(evDate.getHours() + 8);
            const eventDate = new Date(evDate.toDateString());

            console.log(currentDate.toLocaleDateString(), eventDate.toLocaleDateString());

            let newStatus;
            if (eventDate.toDateString() === currentDate.toDateString()) {
              newStatus = EventStatus.live;
            } else if (eventDate < currentDate) {
              newStatus = EventStatus.completed;
            } else {
              newStatus = EventStatus.scheduled;
            }

            if (event.status !== newStatus) {
              const updatedEventStatus = await prisma.event.update({
                where: { id: event.id },
                data: {
                  status: newStatus,
                  pic_id: event.pic_id,
                },
              });

              console.log(updatedEventStatus);
            }
          })
        );
      } catch (error) {
        console.error('Error updating event status:', error);
      }
    });

    job.start(); // Start the cron job

  } catch (error) {
    console.error('Error scheduling cron job:', error);
  }
};

(async () => {
  try {
    updateEventStatus();
    console.log('Event status update started.');
  } catch (error) {
    console.error('Error updating event status:', error);
  }
})();