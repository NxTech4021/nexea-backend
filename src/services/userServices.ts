import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const getUserFromDatabase = async (): Promise<object> => {
  const user = await prisma.user.findMany();
  return user;
};

const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

// Function for updating data
const userUpdateService = async (
  _req: any,
  _res: any,
  userNewData: { id: string; name: string; email: string; password: string; address: string; department: string },
) => {
  // Hash the password
  const saltRounds = 10; // You can adjust the salt rounds as needed
  const hashedPassword = await bcrypt.hash(userNewData.password, saltRounds);

  try {
    const updateUser = await prisma.user.update({
      where: {
        id: userNewData.id,
      },
      data: {
        name: userNewData.name,
        email: userNewData.email,
        password: hashedPassword,
        address: userNewData.address,
        department: userNewData.department,
      },
    });
    // res.status(200).send('User updated successfully');
    return updateUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

export { getUserFromDatabase, getUser, userUpdateService };
