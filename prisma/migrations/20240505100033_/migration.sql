/*
  Warnings:

  - You are about to drop the column `userLevel` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CheckIns" AS ENUM ('Yes', 'No');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('admin', 'normal');

-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "buyerName" TEXT,
ADD COLUMN     "checkedIn" "CheckIns",
ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userLevel",
ADD COLUMN     "userType" "Type" DEFAULT 'normal';
