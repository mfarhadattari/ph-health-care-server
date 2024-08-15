-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "appointmentFee" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'UNPAID',
ALTER COLUMN "paymentGetewayData" DROP NOT NULL;
