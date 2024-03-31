/*
  Warnings:

  - You are about to drop the column `attendance` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Attendee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Attendee_email_key";

-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "attendance",
DROP COLUMN "email",
ADD COLUMN     "buyerEmail" TEXT,
ADD COLUMN     "buyerFirstName" TEXT,
ADD COLUMN     "buyerLastName" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "discountCode" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "orderNumber" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "ticketCode" TEXT,
ADD COLUMN     "ticketID" TEXT,
ADD COLUMN     "ticketTotal" TEXT,
ADD COLUMN     "ticketType" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;
