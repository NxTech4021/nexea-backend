import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  updateEventStatus,
  // sendingText,
  // sendingImg,
  // sendingLocation,
} from '@controllers/eventController';
import isAdmin from '@middlewares/isAdmin';
import axios from 'axios';
import { Router } from 'express';
import querystring from 'querystring';

const options = {
  method: 'POST',
  url: 'https://api.gupshup.io/wa/api/v1/msg',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    apikey: process.env.GUPSHUP_API_KEY,
  },
  form: {
    message: '{"type":"text","text":"hheadsad"}',
    'src.name': process.env.GUPHUP_APP_NAME,
    disablePreview: false,
    encode: false,
    source: 601154585110,
    channel: 'whatsapp',
    destination: 60174890307,
  },
};

export const eventRouter = Router();

eventRouter.route('/create').post(createEvent);
eventRouter.route('/events').get(getAllEvents);
eventRouter.route('/delete/:id').delete(isAdmin, deleteEvent);
eventRouter.route('/update/:id').put(updateEvent);
eventRouter.route('/status/:id').put(updateEventStatus);
eventRouter.route('/:id').get(getEvent);

eventRouter.route('/testapi').post(async () => {
  try {
    const response = await axios.post(
      'https://api.gupshup.io/sm/api/v1/msg',
      querystring.stringify({
        channel: 'whatsapp',
        'src.name': process.env.GUPHUP_APP_NAME,
        source: 601154585110,
        destination: 60174890307,
        message: JSON.stringify(
          "%7B%22type%22%3A%22text%22%2C%22text%22%3A%22%F0%9F%93%85%20Friendly%20Checkup%20Reminder!%20%F0%9F%8F%A5%5Cn%5CnHello%20%7B%7B1%7D%7D%2C%5Cn%5CnJust%20a%20gentle%20reminder%20that%20your%20checkup%20at%20%7B%7B2%7D%7D%20on%20%7B%7B3%7D%7D%20is%20approaching.%20Please%20ensure%20you're%20ready%20for%20your%20appointment.%5Cn%5CnThank%20you%2C%5Cn%7B%7B4%7D%7D%20Team%22%7D",
        ),
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          apikey: process.env.GUPSHUP_API_KEY,
        },
      },
    );

    console.log('Message sent:', response.data);
  } catch (error: any) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
});
// eventRouter.route('/sendtext').post(sendingText);
// eventRouter.route('/sendimage').post(sendingImg);
// eventRouter.route('/sendlocation').post(sendingLocation);
