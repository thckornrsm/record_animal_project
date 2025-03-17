/*
  Warnings:

  - You are about to drop the column `healthStatus` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Medical_Record" ADD COLUMN     "appointmentDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "healthStatus";
