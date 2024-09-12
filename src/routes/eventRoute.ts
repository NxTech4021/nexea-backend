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

eventRouter.route('/testapi').post(async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.gupshup.io/sm/api/v1/msg',
      querystring.stringify({
        channel: 'whatsapp',
        'src.name': process.env.GUPHUP_APP_NAME,
        source: 601154585110,
        destination: 60174890307,
        message: `%7B%22type%22%3A%22location%22%2C%22name%22%3A%221513%20%20Farnum%20Road%22%2C%22address%22%3A%22New%20York%2010019%22%2C%22longitude%22%3A-79.0896492%2C%22latitude%22%3A42.5950661%2C%22caption%22%3A%22Dear%20Afiq%20Danial%5Cn%5CnEntrepenuers%20Summit%20V%202024%20is%20happening%20in%202%20weeks%20%E2%9C%A8%20Attached%20below%20are%20the%20map%20and%20directions%20to%20the%20venue.%20Do%20take%20note%20that%20*parking%20is%20limited*%2C%20we%20strongly%20advise%20you%20to%20take%20public%20transport%20or%20Grab.%20%5Cn%5CnWarm%20regards%2C%5CnNexea%20Team%22%7D&`,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          apikey: process.env.GUPSHUP_API_KEY,
        },
      },
    );

    console.log('Message sent:', response.data);
    return res.status(200).send('Done');
  } catch (error: any) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
});
// eventRouter.route('/sendtext').post(sendingText);
// eventRouter.route('/sendimage').post(sendingImg);
// eventRouter.route('/sendlocation').post(sendingLocation);
