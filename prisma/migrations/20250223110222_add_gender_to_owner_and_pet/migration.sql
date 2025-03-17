-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "gender" TEXT NOT NULL DEFAULT 'unknown';

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "gender" TEXT NOT NULL DEFAULT 'unknown';
