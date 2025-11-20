/*
  Warnings:

  - You are about to drop the column `end_date` on the `job_seeker_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `job_seeker_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "job_seeker_profiles" DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);
