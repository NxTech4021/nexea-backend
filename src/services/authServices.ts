import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { verificationToken } from '@utils/JwtHelper';

const prisma = new PrismaClient();




export const getLoginUser = async (email: string): Promise<any | null> => {
  const existUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
      password: true,
    },
  });

  if (!existUser) {
    return null;
  }

  return existUser;
};

export const registerService = async ({ name, email, password }: any) => {
  const saltRounds = 10; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const verifyToken = verificationToken(email);
  console.log('Verification Token:', verifyToken);

  // Create the new user with the hashed password
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      confirmationToken: verifyToken,
      verified: false,
    },
  });

  return newUser;
};

export const forgetpassService = async (email: string): Promise<any | null> => {
  // Generate and set password reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log('Reset Token', resetPasswordToken);
  const resetPasswordExpires = new Date(Date.now() + 60 * (60 * 1000)); // 1 hour from now

  const forgetpass = await prisma.user.update({
    where: { email: email },
    data: {
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpires: resetPasswordExpires,
    },
  });

  return forgetpass;
};
