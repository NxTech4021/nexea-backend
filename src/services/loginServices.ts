import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLoginUser = async (email: string): Promise<object | null> => {
  const existUser = await prisma.user.findFirst({
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
