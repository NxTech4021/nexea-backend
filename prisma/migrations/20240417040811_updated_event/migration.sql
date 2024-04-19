-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventStatus" ADD VALUE 'scheduled';
ALTER TYPE "EventStatus" ADD VALUE 'completed';
ALTER TYPE "EventStatus" ADD VALUE 'postponed';

-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "eventId" TEXT;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
