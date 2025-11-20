/*
  Warnings:

  - Made the column `updated_at` on table `job_seeker_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "job_seeker_profiles" ALTER COLUMN "updated_at" SET NOT NULL;
