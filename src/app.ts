import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { routes } from '@routes/index';
import session from 'express-session';

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

app.use(session({ secret: 'nexeaeventapp', saveUninitialized: true, resave: false }));

app.use('/api', routes);

app.get('/', async (_req: Request, res: Response) => {
  res.send('Server is running');
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${process.env.PORT}...`);
});
