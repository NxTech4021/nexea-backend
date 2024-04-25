import {
  registerUser,
  getlogin,
  getprofile,
  forgetPassword,
  resetPassword,
  verifyUser,
  logout,
} from '@controllers/authController';
import { Router } from 'express';
import { validateToken } from '@utils/JwtHelper';
// import jwt from 'jsonwebtoken';
// import { login } from '../controllers/index';

export const authRouter = Router();

//Register

authRouter.route('/register').post(registerUser);

//login + logout

authRouter.route('/login').post(getlogin);

authRouter.route('/logout').post(logout);

//Profile

authRouter.route('/me').get(validateToken, getprofile);

// Password

authRouter.route('/forget-password').post(forgetPassword);
authRouter.route('/reset-password').post(resetPassword);

//Verify
authRouter.route('/verify').post(verifyUser);
