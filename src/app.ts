import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { routes } from '@routes/index';
import session from 'express-session';
import multer from 'multer';
import { prisma } from '@configs/prisma';
import { uploadAttendees } from '@controllers/attendeeController';
import cookieParser from 'cookie-parser';
import { extractCSVData } from '@services/attendeeServices';


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

app.use('/api', routes);

app.get('/', async (_req: Request, res: Response) => {
  res.send('Server is running');
});

//get all users
app.get('/users', async (_req, res) => {
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
app.get('/attendees', async (_req, res) => {
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

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'csvuploads/');
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route for file upload
app.post('/api/upload', upload.single('file'), uploadAttendees);

// Route for file download
app.get('/api/download', extractCSVData );

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${process.env.PORT}...`);
  console.log('Test on extracting data for new CSV file');
});
