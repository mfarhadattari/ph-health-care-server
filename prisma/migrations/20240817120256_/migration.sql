/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,scheduleId]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "appointments_doctorId_scheduleId_key" ON "appointments"("doctorId", "scheduleId");
