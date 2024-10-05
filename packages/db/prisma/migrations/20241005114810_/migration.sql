-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "problemId" INTEGER NOT NULL,
    "arenaId" INTEGER NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
