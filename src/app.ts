import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { routes } from './routes';

dotenv.config();

const prisma = new PrismaClient();
const app: Application = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(cors());
app.use(morgan('combined'));

app.use('/api', routes);

app.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
    return res.json(users);
  } catch (error) {
    // Handle error
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${process.env.PORT}...`);
});
