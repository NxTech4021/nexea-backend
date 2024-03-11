//const { sign, verify } = require("jsonwebtoken");
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sign, verify } from 'jsonwebtoken';

dotenv.config();

//const SECRET_KEY = 'helloafiqqq';

export const accessTokens = (userId : number ) : string => {

  const accessToken = sign({ userId }, process.env.SECRET_KEY as string , { expiresIn: '1h' });

  return accessToken;
};


export const validateToken = (req: any, res: Response, next: NextFunction) => {
  const accessToken = req.cookies["access-token"];

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

