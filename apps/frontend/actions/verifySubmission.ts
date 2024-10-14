"use server";
import assert from "assert";
import { getServerSession } from "next-auth";
import db from "@/db";
import { authOptions } from "@/app/authConfig";
import RedisManager from "@/RedisManager";

const redis = RedisManager.getInstance();
export default async function verifySubmission(submission_id: number, token: string) {
    const session = await getServerSession(authOptions);
    assert(session, "Session not found");
    try {
        const submission = await db.submission.update({
            where: {
                id: submission_id,
            },
            data: {
                userId: session.user.id,
            }
        })
    } catch (error) {
        throw new Error("submission not found");
    }

    // return when resigned
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
            }
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
                        rank: prevStandings + 1,
                    }
                });
                assert(_createdStanding, "Failed to create standing");

                if (arena.Standings.length + 1 === arena.users.length) {
                    await db.arena.update({
                        where: {
                            id: arena.id
                        },
                        data: {
                            phase: "Lobby"
                        }
                    });
                    redis.publish(
                        token,
                        {
                            e: "FINISH_ARENA",
                        }
                    )
                }
                return { standings: prevStandings + 1 };

            } catch (error) {
                console.log("Failed to create standings");
            }
        }
    }
    return false;
}	
