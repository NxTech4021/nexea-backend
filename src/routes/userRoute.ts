import { Router } from 'express';

export const userRoute = Router();

userRoute.get('/', (req, res) => {
  const a = req.headers['cookie'];
  res.send(a);
});
