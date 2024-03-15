import { Request, Response } from 'express';
import { accessTokens } from '../utils/JwtHelper';

import bcrypt from 'bcrypt';
import { registerService, getLoginUser } from '@services/authServices';

// Login function
export const getlogin = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    // Find user by email
    //const user = await prisma.user.findUnique({ where: { email } });
    const user = await getLoginUser(email);
    console.log('user', user);

    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }

    // Compare passwords

    let match;
    if (password && user.password) {
      match = await bcrypt.compare(password, user.password);
    }
    if (!match) {
      return res.status(400).json({ error: 'Wrong email or password' });
    }

    if (!user.email) {
      return res.status(500).json({ error: 'Internal server error: User ID is null or undefined' });
    }
    // If password matches, create a token

    const token = accessTokens(user.id);
    //const refreshtoken = refreshTokens (user.id)

    res.cookie('access-token', token, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
    });

    return res.json('Logged in!');

    // Send token in response
    //return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Register

export const registerUser = async (req: Request, res: Response) => {
  try {
    await registerService(req.body);

    return res.json({
      message: `${req.body.name} account has been created`,
    });
  } catch (error) {
    return res.status(404).json({
      error: (error as any).message,
    });
  }
};

export const getprofile = async (_req: Request, res: Response) => {
  try {
    return res.json('registered');
  } catch (error) {
    return res.status(404).json({
      error: (error as any).message,
    });
  }
};

// // export const logout = (req: Request, res: Response): void => {
// //   // Destroy the user's session
// //   req.session.destroy((error) => {
// //     if (error) {
// //       console.error(error);
// //       return res.sendStatus(500);
// //     }
// //     // Redirect the user to the home page or login page
// //     return res.redirect('/');
// //   });
// // };
