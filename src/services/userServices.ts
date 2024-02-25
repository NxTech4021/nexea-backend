import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUserFromDatabase = async (): Promise<object> => {
  const user = await prisma.user.findMany();
  return user;
};

export { getUserFromDatabase };
