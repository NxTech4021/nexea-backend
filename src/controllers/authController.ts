import { Request, Response } from 'express';
import { accessTokens } from '../utils/JwtHelper';
import { prisma } from '@configs/prisma';
import bcrypt from 'bcrypt';
import { registerService, getLoginUser, forgetpassService } from '@services/authServices';
import { sendConfirmationEmail, sendResetEmail } from '@utils/nodemailer.config';
import { verificationCode } from '../utils/JwtHelper';
import { getUser } from '@services/userServices';
import { isAdmin } from '@utils/isAdmin';

// Login function
export const getlogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await getLoginUser(email);

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    if (!user.verified) {
      return res.status(404).json({ message: 'User is not verified' });
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

    const session = req.session;

    session.userid = user.id;
    session.userType = user.userType;

    res.cookie('accessToken', token, {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000, // 1 Days
    });

    return res.status(200).json({ accessToken: token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Register
export const registerUser = async (req: Request, res: Response) => {
  let name;
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
      return res.send('Please add email and password');
    }

    name = firstName.concat(' ', lastName);

    const isUserExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (isUserExist) {
      return res.status(400).json({ message: 'User already exist' });
    }

    const user = await registerService({ name, email, password });

    try {
      await sendConfirmationEmail(user.email, user.name, user.confirmationCode);
      return res.status(200).json({ message: 'Password reset email has been sent.', user: { email: user.email } });
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred while sending the password reset email' });
    }
  } catch (error) {
    return res.status(404).json({
      error: (error as any).message,
    });
  }
};

//Token verification
// export const verifyUser = async (req: Request, res: Response) => {
//   const { token } = req.params;

//   try {
//     // Find the user by the verification token
//     const user = await prisma.user.findUnique({
//       where: {
//         confirmationCode: parseInt(token),
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Update the user's verified status
//     const updatedUser = await prisma.user.update({
//       where: {
//         id: user.id,
//       },
//       data: {
//         verified: true,
//       },
//     });

//     return res.status(200).json({ message: 'User verified successfully', user: updatedUser });
//   } catch (error) {
//     console.error('Error verifying user:', error);
//     return res.status(500).json({ error: 'An error occurred while verifying the user' });
//   }
// };

export const verifyUser = async (req: Request, res: Response) => {
  const { code, email } = req.body;

  try {
    // Find the user by the verification token
    const user = await prisma.user.findFirst({
      where: {
        AND: {
          email: email,
          confirmationCode: parseInt(code),
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Please make sure the email and code is correct.' });
    }

    // Update the user's verified status
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
        confirmationCode: null,
        userType: isAdmin(email) ? 'admin' : 'normal',
      },
    });

    const token = accessTokens(updatedUser.id);

    res.cookie('accessToken', token, {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000, // 1 Day
    });

    return res.status(200).json({ message: 'User verified successfully', user: updatedUser });
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ error: 'An error occurred while verifying the user' });
  }
};

export const resendConfirmationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new verification token
    const newVerifyCode = verificationCode();

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        confirmationCode: newVerifyCode,
      },
    });

    // Send the confirmation email with the new verification token
    await sendConfirmationEmail(updatedUser.email, updatedUser.name, newVerifyCode);

    return res.status(200).json({ message: 'A new verification email has been sent to ' + email });
  } catch (error) {
    console.error('Error resending confirmation email:', error);
    return res.status(404).json({ message: 'An error occurred while resending the confirmation email' });
  }
};

//Token verification
// export const verifyUser = async (req: Request, res: Response) => {
//   const { token } = req.params;

//   try {
//     // Find the user by the verification token
//     const user = await prisma.user.findFirst({
//       where: {
//         confirmationToken: token,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Update the user's verified status
//     const updatedUser = await prisma.user.update({
//       where: {
//         id: user.id,
//       },
//       data: {
//         verified: true,
//       },
//     });

//     return res.status(200).json({ message: 'User verified successfully', user: updatedUser });
//   } catch (error) {
//     console.error('Error verifying user:', error);
//     return res.status(500).json({ error: 'An error occurred while verifying the user' });
//   }
// };

export const getprofile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user as any;
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
      return res.status(404).json({ message: 'Email is required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const user = await forgetpassService(email);

    try {
      await sendResetEmail(user.email, user.name, user.resetPasswordToken);
      return res.status(200).json({ message: 'Password reset email has been sent.', user: user });
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred while sending the password reset email' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

// eslint-disable-next-line no-unused-vars
export const resetPassword = async (req: Request, res: Response) => {
  const { email, password, code } = req.body;

  // Validate the reset token and check if it's expired
  const user = await prisma.user.findFirst({
    where: { AND: { resetPasswordToken: code, email: email } },
  });

  if (!user || user.resetPasswordExpires === null || Date.now() > user.resetPasswordExpires.getTime()) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  // Hash the new password and update the user's record
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
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

  req.session.destroy((error: any) => {
    if (error) {
      return res.sendStatus(500);
    }
    // Redirect the user to the home page or login page
    res.clearCookie('accessToken');
    res.clearCookie('userid');
    res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: false });
    return res.status(200).json({ message: 'Successfully Logout' });
  });
};
