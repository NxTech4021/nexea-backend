import { Request, Response } from 'express';
import { accessTokens } from '../utils/JwtHelper';
import { prisma } from '@configs/prisma';
//import crypto from 'crypto'
import bcrypt from 'bcrypt';
import { registerService, getLoginUser, forgetpassService } from '@services/authServices';
import { sendResetEmail } from '@utils/nodemailer.config';
import { getUser } from '@services/userServices';

// Login function
export const getlogin = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    // Find user by email
    //const user = await prisma.user.findUnique({ where: { email } });
    const user = await getLoginUser(email);

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // Compare passwords

    let match;
    if (password && user.password) {
      match = await bcrypt.compare(password, user.password);
    }
    if (!match) {
      return res.status(400).json({ message: 'Wrong email or password' });
    }

    if (!user.email) {
      return res.status(500).json({ message: 'Internal server error: User ID is null or undefined' });
    }
    // If password matches, create a token

    const token = accessTokens(user.id);
    //const refreshtoken = refreshTokens (user.id) //Only using accesstoken to authenticate

    res.cookie('accessToken', token, {
      maxAge: 60 * 60 * 24 * 1000, // 1 Day
      httpOnly: true,
    });

    return res.status(200).json({ accessToken: token, user });

    //Send token in response
    //return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Register

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const name = firstName + ' ' + lastName;
    const newUser = await registerService({ name, email, password });

    const token = accessTokens(newUser.id);
    //const refreshtoken = refreshTokens (user.id) //Only using accesstoken to authenticate

    res.cookie('accessToken', token, {
      maxAge: 60 * 60 * 24 * 1000, // 1 Day
      httpOnly: true,
    });

    return res.status(200).json({ accessToken: token, user: { id: newUser.id, name: newUser.name } });
    // return res.json({
    //   message: `${req.body.name} account has been created`,
    // });
  } catch (error) {
    return res.status(404).json({
      message: (error as any).message,
    });
  }
};

export const getprofile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user as any;
    console.log(userId);
    const user = await getUser(userId);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(404).json({
      error: (error as any).message,
    });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.send('Please add email');
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ error: "User Doesn't Exist" });
    }

    await forgetpassService(email);
    try {
      await sendResetEmail(user.email, user.name, user.resetPasswordToken);
      return res.json({ message: 'Password reset email has been sent.' });
    } catch (error) {
      console.error('Error sending reset email:', error);
      return res.status(500).json({ error: 'An error occurred while sending the password reset email' });
    }
  } catch (error) {
    console.error('Error processing forget password request:', error);
    return res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

export const resetPassword = async (_req: Request, res: Response) => {
  const { resetToken, newPassword, confirmPassword } = _req.body;

  // Validate the reset token and check if it's expired
  const user = await prisma.user.findUnique({
    where: { resetPasswordToken: resetToken },
  });

  if (!user || user.resetPasswordExpires === null || Date.now() > user.resetPasswordExpires.getTime()) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  // Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Hash the new password and update the user's record
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { resetPasswordToken: resetToken },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return res.status(200).json({ message: 'Password reset successful' });
};

export const logout = (req: Request, res: Response): void => {
  // Destroy the user's session

  req.session.destroy((error) => {
    if (error) {
      return res.sendStatus(500);
    }
    // Redirect the user to the home page or login page
    res.clearCookie('accessToken');
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: false });
    return res.status(200).json({ message: 'Successfully Logout' });
  });
};
