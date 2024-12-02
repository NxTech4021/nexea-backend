import { PrismaClient } from '@prisma/client';
import data from '../constants/startupsDatabase.users.json';
// import dayjs from "dayjs";

export const prisma = new PrismaClient();

export async function main(): Promise<void> {
  data.forEach(async (elem) => {
    try {
      await prisma.user.create({
        data: {
          fullName: elem.name,
          email: elem.email,
          password: elem.password,
          isVerified: elem.verified,
          createdAt: typeof elem.createdAt === 'object' ? Object.values(elem.createdAt)[0] : elem.createdAt,
          updatedAt: typeof elem.updatedAt === 'object' ? Object.values(elem.updatedAt)[0] : elem.updatedAt,
        },
      });
    } catch (error) {
      console.log(error);
    }
  });
}
