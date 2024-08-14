/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `patient_health_data` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "patient_health_data_patientId_key" ON "patient_health_data"("patientId");
