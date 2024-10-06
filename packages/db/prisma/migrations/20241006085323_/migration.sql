-- CreateTable
CREATE TABLE "Standings" (
    "id" SERIAL NOT NULL,
    "arenaId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Standings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Standings" ADD CONSTRAINT "Standings_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standings" ADD CONSTRAINT "Standings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
