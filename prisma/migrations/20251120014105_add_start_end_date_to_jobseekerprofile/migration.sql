-- AlterTable
ALTER TABLE "job_seeker_profiles" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3),
ALTER COLUMN "name" DROP NOT NULL;
