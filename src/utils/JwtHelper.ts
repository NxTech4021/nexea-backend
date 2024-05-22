import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sign, verify } from 'jsonwebtoken';
// import { v4 as uuidv4 } from 'uuid';

dotenv.config();

export const accessTokens = (userId: string): string => {
  const accessToken = sign({ userId }, process.env.SECRET_KEY as string, { expiresIn: '1d' });

  return accessToken;
};

export const verificationCode = () => {
  // const code = uuidv4().slice(0, 6).toUpperCase();

  const code = Math.floor(100000 + Math.random() * 900000);
  return code;
};

export const validateToken = (req: any, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['accessToken'];
  //const refeshToken = req.cookies["token"]

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

//For email verification
// export const verificationToken = (email: string) => {
//   const verifyToken = sign({ email }, process.env.SECRET_KEY as string, { expiresIn: '1d' });
//   return verifyToken;
// };
