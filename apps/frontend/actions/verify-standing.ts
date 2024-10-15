"use server";
import assert from "assert";
import { getServerSession } from "next-auth";
import db from "@/db";
import { authOptions } from "@/app/authConfig";
import finishArena from "./finish-arena";
import { Result } from "@/components/Smackdown";

export default async function verifyStanding(token: string) {
    const session = await getServerSession(authOptions);
    assert(session, "Session not found");

    const userHasResigned = await db.standings.findFirst({
        where: {
            userId: session.user.id,
            arena: {
                token: token
            },
            resigned: true,
        }
    });
    if (userHasResigned) {
        return false;
    }
    const userWithSubmission = await db.user.findFirst({
        where: {
            id: session.user.id,
            submissions: {
                some: {
                    arena: {
                        token: token
                    }
                }
            }
        },
        select: {
            submissions: {
                where: {
                    arena: {
                        token: token
                    }
                },
                select: {
                    problemId: true,
                }
            }
        }
    });

    const arena = await db.arena.findFirst({
        where: {
            token: token,
        },
        select: {
            id: true,
            problems: {
                select: {
                    problemId: true,
                }
            },
            Standings: {
                select: {
                    id: true,
                    resigned: true,
                },
            },
            users: {
                select: {
                    id: true,
                }
            },
            points: true
        }
    });
    assert(arena, "Arena not found");

    const notResignedStandings = arena.Standings.filter((standing) => {
        return !standing.resigned;
    });

    if (userWithSubmission && arena) {
        const allSubmissions = userWithSubmission.submissions.map((submission) => {
            return submission.problemId;
        });
        const allProblems = arena.problems.map((problem) => {
            return problem.problemId;
        });
        const solvedAllProblems = allProblems.every((problem) => {
            return allSubmissions.includes(problem);
        });
        if (solvedAllProblems) {
            const prevStandings = notResignedStandings.length;
            try {
                const _createdStanding = await db.standings.create({
                    data: {
                        userId: session.user.id,
                        arenaId: arena.id,
                        points: arena.points
                    }
                });
                assert(_createdStanding, "Failed to create standing");

                if (arena.Standings.length + 1 === arena.users.length) {
                    finishArena(token);
                }
                const res: Result = {
                    score: arena.points,
                    bestScore: arena.points,
                    solved: arena.problems.length,
                    solvedOutOf: arena.problems.length,
                    token: token,
                }
                return res;

            } catch (error) {
                console.log("Failed to create standings");
            }
        }
    }
    return false;
}
