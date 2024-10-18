import { getServerSession } from "next-auth";
import db from "@/db";
import { authOptions } from "@/app/authConfig";
import assert from "assert";
import Smackdown from "@/components/Smackdown";
import { redirect } from "next/navigation";
export default async function Battle({ params: { token } }: { params: { token: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return redirect(`/arena/${token}`);
    }
    const userId = session.user.id;
    const arena = await db.arena.findFirst({
        where: {
            token,
        },
        select: {
            phase: true,
            timeLimit: true,
            Standings: {
                select: {
                    userId: true,
                    resigned: true
                }
            },
            users: {
                where: {
                    id: userId
                }
            }
        },
    });
    if (!arena) {
        return redirect(`/`);
    }

    if (arena.phase === "Lobby" || !arena.users.length) {
        return redirect("/arena/" + token);
    }

    const spectateEligible = arena.Standings.some((standing) => {
        return standing.userId === userId;
    });

    const problems = await db.arena.findFirst({
        where: {
            token: token,
            users: {
                some: {
                    id: userId
                }
            }
        },
        select: {
            problems: {
                select: {
                    problem: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            difficulty: true,
                            boilerplate: true,
                            TestCases: {
                                select: {
                                    input: true,
                                    output: true,
                                    id: true,
                                }
                            },
                        }
                    }
                }
            }
        }
    });
    assert(problems, "No battle found");
    const parsedProblems = problems?.problems.map(problem => problem.problem);
    return (
        <Smackdown token= { token } spectateEligible = { spectateEligible } problemsData = { parsedProblems } timeLimit = { arena.timeLimit } />
    )
}
