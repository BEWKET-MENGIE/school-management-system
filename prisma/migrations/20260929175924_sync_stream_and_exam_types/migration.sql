-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('QUIZ', 'ASSIGNMENT', 'MIDTERM', 'FINAL');

-- AlterEnum
ALTER TYPE "Stream" ADD VALUE 'GENERAL';

-- AlterTable
ALTER TABLE "ClassSection" ADD COLUMN     "stream" "Stream" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "Examination" ADD COLUMN     "type" "ExamType" NOT NULL DEFAULT 'FINAL';

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "currentStream" SET DEFAULT 'GENERAL';
