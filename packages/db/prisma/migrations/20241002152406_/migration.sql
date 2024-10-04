/*
  Warnings:

  - You are about to drop the column `admin` on the `User` table. All the data in the column will be lost.
  - Added the required column `admin` to the `Arena` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Arena" ADD COLUMN     "admin" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "admin";
