import { Response, NextFunction, Request } from 'express';
import dotenv from 'dotenv';
import { sign, verify } from 'jsonwebtoken';

dotenv.config();

export const accessTokens = (userId: number): string => {
  const accessToken = sign({ userId }, process.env.SECRET_KEY as string, { expiresIn: '1d' });

  return accessToken;
};

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['accessToken'];

  if (!accessToken) return res.status(400).json({ error: 'User not Authenticated!' });

  try {
    const validToken = verify(accessToken, process.env.SECRET_KEY as string);
    if (validToken) {
      req.authenticated = true;
      req.user = validToken;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

// export const verificationToken = (email: string) => {
//   const verifyToken = sign({ email }, process.env.SECRET_KEY as string, { expiresIn: '1d' });
//   return verifyToken;
//  };

