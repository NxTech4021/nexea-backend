import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { routes } from '@routes/index';
import session from 'express-session';
import { prisma } from '@configs/prisma';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { Storage } from '@google-cloud/storage';

dotenv.config();

const storage = new Storage({
  keyFilename: `src/configs/nexea-service.json`,
});

const bucket = storage.bucket('nexea');

const app: Application = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
// app.use(fileUpload());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/',
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

// This feature is to upload image in google cloud and receive the public url and store it in database
// eslint-disable-next-line no-unused-vars
app.post('/upload', (req, res) => {
  if (!req.files) {
    res.send('Takdo');
  }

  const { id } = req.body;
  const { image } = req.files as any;

  bucket.upload(image.tempFilePath, { destination: `profile/${image.name}` }, (err, file) => {
    if (err) {
      console.error(`Error uploading image image_to_upload.jpeg: ${err}`);
    } else {
      file?.makePublic(async (err) => {
        if (err) {
          console.error(`Error making file public: ${err}`);
        } else {
          console.log(`File ${file.name} is now public.`);
          const publicUrl = file.publicUrl();
          res.send(publicUrl);

          await prisma.user.update({
            where: {
              id: Number(id),
            },
            data: {
              photoURL: publicUrl,
            },
          });
        }
      });
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}...`);
});
