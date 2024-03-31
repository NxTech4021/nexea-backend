import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUserFromDatabase = async (): Promise<object> => {
  const user = await prisma.user.findMany();
  return user;
};

const getUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

export { getUserFromDatabase, getUser };
