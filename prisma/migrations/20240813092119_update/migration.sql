/*
  Warnings:

  - You are about to drop the column `exprience` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `qulification` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `registractionNumber` on the `doctors` table. All the data in the column will be lost.
  - Added the required column `qualification` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationNumber` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "exprience",
DROP COLUMN "qulification",
DROP COLUMN "registractionNumber",
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "qualification" TEXT NOT NULL,
ADD COLUMN     "registrationNumber" TEXT NOT NULL;
