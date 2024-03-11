import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; 

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



export const registerService = async ({name, email, password}:any) => {
  // Hash the password
  const saltRounds = 10; // You can adjust the salt rounds as needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create the new user with the hashed password
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  return newUser;
};

