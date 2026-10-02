/*
  Warnings:

  - Added the required column `gradeLevel` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "gradeLevel" INTEGER NOT NULL;
