import { Router } from 'express';
//import { getUser } from '../controllers/index';

import { forgetPassword , resetPassword } from '@controllers/passwordController';


export const passwordRouter = Router();


passwordRouter.route('/forget-password').post(forgetPassword)
passwordRouter.route('/reset-password').post(resetPassword)
  


//userRouter.route('/').get(getUser);
