import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

// Function for updating data
const userUpdateService = async (
  req: any,
  _res: any,
  userNewData: { id: any; name: any; email: any; password: any; address: any; department: any },
) => {
  // Hash the password
  const saltRounds = 10; // You can adjust the salt rounds as needed
  const hashedPassword = await bcrypt.hash(userNewData.password, saltRounds);
  const id = parseInt(req.params.id);

  try {
    const updateUser = await prisma.user.update({
      where: {
        id: id,
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
