/*
  Warnings:

  - Added the required column `boilerplate` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testBiolerCode` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "boilerplate" TEXT NOT NULL,
ADD COLUMN     "testBiolerCode" TEXT NOT NULL;
