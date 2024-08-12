/*
  Warnings:

  - You are about to drop the column `contractNumber` on the `admins` table. All the data in the column will be lost.
  - Added the required column `contactNumber` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "contractNumber",
ADD COLUMN     "contactNumber" TEXT NOT NULL;
