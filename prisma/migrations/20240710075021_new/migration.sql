/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ticketCode]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('Pending', 'Sent');

-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "templateOne" "NotificationStatus" DEFAULT 'Pending',
ADD COLUMN     "templateThree" "NotificationStatus" DEFAULT 'Pending',
ADD COLUMN     "templateTwo" "NotificationStatus" DEFAULT 'Pending';

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_id_key" ON "Attendee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_ticketCode_key" ON "Attendee"("ticketCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
