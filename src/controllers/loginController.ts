import { Request, Response } from 'express';
import { getLoginUser } from '@services/loginServices';

export const login = async (req: Request, res: Response): Promise<string | object | null> => {
  const { email } = req.body;

  if (!email) {
    return res.send('Please provide email');
  }

  const user = await getLoginUser(email);

  if (!user) {
    return res.sendStatus(404);
  }

  return res.send(user);
};
