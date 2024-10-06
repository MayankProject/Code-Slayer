/*
  Warnings:

  - A unique constraint covering the columns `[arenaId,userId]` on the table `Standings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Standings_arenaId_userId_key" ON "Standings"("arenaId", "userId");
