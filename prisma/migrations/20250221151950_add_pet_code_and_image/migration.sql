/*
  Warnings:

  - A unique constraint covering the columns `[pet_code]` on the table `Pet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pet_code` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "image" TEXT,
ADD COLUMN     "pet_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pet_pet_code_key" ON "Pet"("pet_code");
