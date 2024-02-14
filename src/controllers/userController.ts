import { Request, Response } from 'express';
import { getUserFromDatabase } from '../services/index';

const getUser = async (_req: Request, res: Response) => {
  const data = await getUserFromDatabase();
  res.cookie('HA', 'ADWAD', { maxAge: 60000 });
  res.status(200).json(data);
};

export { getUser };
