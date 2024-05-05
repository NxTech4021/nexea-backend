/* eslint-disable no-unused-vars */
import { NextFunction, Response, Request } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { userType } = req.session;

  if (!userType) {
    return res.status(404).json({ message: 'Unauthorized' });
  }

  if (userType === 'normal') {
    return res.status(400).json({ message: 'Forbidden' });
  }

  return next();
};

export default isAdmin;
