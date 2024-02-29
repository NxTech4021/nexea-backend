import { Router } from 'express';
//import { getUser } from '../controllers/index';


import { createUser, getUser } from '@controllers/registerController';

export const userRouter = Router();


// register
userRouter.route('/get-user').get(getUser)
userRouter.route('/register').post(createUser)
  


//userRouter.route('/').get(getUser);
