/*
  Warnings:

  - You are about to drop the column `createdAt` on the `specialties` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `specialties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "specialties" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
