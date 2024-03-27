import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { routes } from '@routes/index';
import session from 'express-session';
import { prisma } from '@configs/prisma';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(cors());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(session({ secret: 'nexeaeventapp', saveUninitialized: true, resave: false }));

app.use(routes);

app.get('/', async (_req: Request, res: Response) => {
  res.send('Server is running...');
});

//get all users
app.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

//get all attendees
app.get('/attendees', async (_req: Request, res: Response) => {
  try {
    const attendee = await prisma.attendee.findMany();
    res.status(200).json(attendee);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${process.env.PORT}...`);
  console.log('Test on extracting data for new CSV file');
});
