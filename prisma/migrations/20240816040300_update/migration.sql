/*
  Warnings:

  - You are about to drop the column `paymentGetewayData` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentGetewayData",
ADD COLUMN     "paymentGatewayData" JSONB;
