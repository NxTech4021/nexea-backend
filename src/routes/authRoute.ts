
import { registerUser,  getlogin, getUser } from '@controllers/authController';
import { Router } from 'express';
// import { login } from '../controllers/index';

export const authRouter = Router();

//Register 

authRouter.route('/register').post(registerUser)

//login + logout

authRouter.route('/login').post(getlogin);
//authRouter.route('/logout').post(logout);


//Profile
authRouter.route('/').get(getUser);

