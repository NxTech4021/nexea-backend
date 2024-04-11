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
import bcrypt from 'bcrypt';

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

// Testing. later delete for production
app.get('/cookie', (req, res) => {
  res.send(req.cookies);
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

app.patch('/update', async (req: any, res: any) => {
  try {
    const { id, name, address, email, department, password } = req.body;
    const { files } = req;
    const saltRounds = 10;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    if (files && files.image) {
      const { image } = files as any;

      bucket.upload(image.tempFilePath, { destination: `profile/${image.name}` }, (err, file) => {
        if (err) {
          console.error(`Error uploading image ${image.name}: ${err}`);
          res.status(500).send('Error uploading image.');
        } else {
          file?.makePublic(async (err) => {
            if (err) {
              console.error(`Error making file public: ${err}`);
              res.status(500).send('Error making file public.');
            } else {
              console.log(`File ${file.name} is now public.`);
              const publicUrl = file.publicUrl();

              await prisma.user.update({
                where: {
                  id: Number(id),
                },
                data: {
                  photoURL: publicUrl,
                  name,
                  address,
                  email,
                  department,
                },
              });

              res.send(publicUrl);
            }
          });
        }
      });
    } else {
      await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          address,
          email,
          department,
          password: hashedPassword,
        },
      });

      return res.send('User information updated.');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred.');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}...`);
});
