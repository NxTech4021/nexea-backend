import { Request, Response } from 'express';
import { prisma } from '@configs/prisma';
//import { getLoginUser } from '@services/loginServices';
import { createTokens } from '../utils/JwtHelper';
import bcrypt from 'bcrypt';

export const getLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) res.status(400).json({ error: "User Doesn't Exist" });

  // Compare password
  const dbPassword = user?.password;

  if (dbPassword !== undefined && dbPassword !== null) {
    bcrypt
      .compare(password, dbPassword)
      .then((match) => {
        if (!match) {
          return res.status(400).json({ error: 'Wrong Username and Password Combination!' });
        } else {
          const accessToken = createTokens(user);

          res.cookie('access-token', accessToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000,
            httpOnly: true,
          });

          return res.json('LOGGED IN');
        }
      })
      .catch((err) => {
        return res.send(err);
      });
  }
};

export const logout = (req: Request, res: Response): void => {
  // Destroy the user's session
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    }
    // Redirect the user to the home page or login page
    return res.redirect('/');
  });
};
