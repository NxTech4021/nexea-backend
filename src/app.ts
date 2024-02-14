import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { routes } from './routes';
// import { main } from './configs/prisma';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('combined'));

app.use('/api', routes);

app.get('/', async (_req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  res.json(user.filter((e) => e.name?.startsWith('A')));
  // res.send('Server running...');
});

// main().then().catch();

// main()
//   .then(() => console.log('DONE'))
//   .catch((e) => console.log(e));

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${process.env.PORT}...`);
});
