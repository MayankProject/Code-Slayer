/*
  Warnings:

  - You are about to drop the column `started` on the `Arena` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('Lobby', 'Battle');

-- AlterTable
ALTER TABLE "Arena" DROP COLUMN "started",
ADD COLUMN     "phase" "Phase" NOT NULL DEFAULT 'Lobby';
