/*
  Warnings:

  - A unique constraint covering the columns `[confirmationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `update_at` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `department` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('live', 'done');

-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "department" SET NOT NULL;

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pic_id" INTEGER NOT NULL,
    "description" VARCHAR(255),
    "date" TIMESTAMP(3) NOT NULL,
    "status" "EventStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_pic_id_key" ON "Event"("pic_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmationToken_key" ON "User"("confirmationToken");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_pic_id_fkey" FOREIGN KEY ("pic_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
