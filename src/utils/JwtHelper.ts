import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sign, verify } from 'jsonwebtoken';

dotenv.config();

export const accessTokens = (userId: number): string => {
  const accessToken = sign({ userId }, process.env.SECRET_KEY as string, { expiresIn: '1d' });

  return accessToken;
};

export const verificationToken = (email: string) => {
  const verifyToken = sign({ email }, process.env.SECRET_KEY as string, { expiresIn: '1d' });
  return verifyToken;
};

// export const refreshTokens = (userId : number ) : string => {

//   const refeshToken = sign({ userId }, process.env.SECRET_KEY_REFESH as string , { expiresIn: '7d' });

//   return refeshToken;
// };

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
