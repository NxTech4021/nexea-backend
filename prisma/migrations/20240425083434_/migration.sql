/*
  Warnings:

  - You are about to drop the column `confirmationToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[confirmationCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_confirmationToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "confirmationToken",
ADD COLUMN     "confirmationCode" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmationCode_key" ON "User"("confirmationCode");
