//const { sign, verify } = require("jsonwebtoken");
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sign, verify } from 'jsonwebtoken';

dotenv.config();

//const SECRET_KEY = 'helloafiqqq';

export const accessTokens = (userId : number ) : string => {

  const accessToken = sign({ userId }, process.env.SECRET_KEY_ACCESS as string , { expiresIn: '15m' });

  return accessToken;
};

export const refreshTokens = (userId : number ) : string => {

  const refeshToken = sign({ userId }, process.env.SECRET_KEY_REFESH as string , { expiresIn: '7d' });

  return refeshToken;
};


export const validateToken = (req: any, res: Response, next: NextFunction) => {
  const accessToken = req.cookies["access-token"];
  //const refeshToken = req.cookies["token"]

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, process.env.SECRET_KEY as string );
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

