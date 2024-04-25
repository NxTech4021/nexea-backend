import { PrismaClient } from '@prisma/client';
import data from '../constants/startupsDatabase.users.json';
// import dayjs from "dayjs";

export const prisma = new PrismaClient();

export async function main(): Promise<void> {
  data.forEach(async (elem) => {
    try {
      await prisma.user.create({
        data: {
          name: elem.name,
          email: elem.email,
          password: elem.password,
          position: elem.position,
          verified: elem.verified,
          // confirmationCode: elem.confirmationToken,
          createdAt: typeof elem.createdAt === 'object' ? Object.values(elem.createdAt)[0] : elem.createdAt,
          updatedAt: typeof elem.updatedAt === 'object' ? Object.values(elem.updatedAt)[0] : elem.updatedAt,
          userLevel: elem.userLevel,
        },
      });
    } catch (error) {
      console.log(error);
    }
  });
}
