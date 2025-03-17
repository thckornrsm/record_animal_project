-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "vetId" INTEGER;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "Veterinarian"("id") ON DELETE SET NULL ON UPDATE CASCADE;
