/* eslint-disable no-unused-vars */
import * as express from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      authenticated: boolean;
      user: string | JwtPayload;
    }
  }
}
