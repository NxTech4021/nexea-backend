import { Request, Response } from 'express';

export const login = async (_req: Request, res: Response) => {
  res.send('LOGIN');
};
