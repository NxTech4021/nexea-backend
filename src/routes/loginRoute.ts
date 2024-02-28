import { Router } from 'express';
// import { login } from '../controllers/index';


export const loginRouter = Router();

//Login router 

//login + logout
loginRouter.route('/login').post(getLogin)
loginRouter.route('/logout').post(logout)

//loginRouter.route('/login').post(login);
