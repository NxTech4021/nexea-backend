import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
// import crypto from 'crypto';
import { verificationCode } from '@utils/JwtHelper';

const prisma = new PrismaClient();

export const getLoginUser = async (email: string): Promise<any | null> => {
  const existUser = await prisma.user.findUnique({
    where: {
      email,
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

  const code = verificationCode();

  // Create the new user with the hashed password
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      confirmationCode: code,
      verified: false,
    },
  });

  return newUser;
};

export const forgetpassService = async (email: string): Promise<any | null> => {
  const resetPasswordToken = verificationCode();

  const resetPasswordExpires = new Date(Date.now() + 60 * (60 * 1000)); // 1 hour from now

  const user = await prisma.user.update({
    where: { email: email },
    data: {
      resetPasswordToken: resetPasswordToken.toString(),
      resetPasswordExpires: resetPasswordExpires,
    },
  });

  return user;
};
