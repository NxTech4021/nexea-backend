//const { sign, verify } = require("jsonwebtoken");
import { Request, Response, NextFunction } from 'express';

import { sign, verify } from 'jsonwebtoken';

// Create a new type the add authenticated inside Request type
interface ReqAuthenticated extends Request {
  authenticated: Boolean;
}

const SECRET_KEY = 'helloafiqqq';

export const createTokens = (user: any) => {
  const accessToken = sign({ username: user.username, id: user.id }, SECRET_KEY);

  return accessToken;
};

export const validateToken = (req: ReqAuthenticated, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['access-token'];

  if (!accessToken) return res.status(400).json({ error: 'User not Authenticated!' });

  try {
    const validToken = verify(accessToken, SECRET_KEY);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
