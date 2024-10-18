"use server";
import { getServerSession } from "next-auth";
import db from "@/db";
import { authOptions } from "@/app/authConfig";
import assert from "assert";
import finishArena from "./finish-arena";
import { Result } from "@/components/Smackdown";
import { redirect } from "next/navigation";
export default async function resign(token: string) {
    const session = await getServerSession(authOptions);
    if(!session){
        return redirect('/') 
    }
    try {
        // Cant resign if you have standing in this arena
        const arena = await db.arena.findFirst({
            where: {
                token: token
            },
            select: {
                id: true,
                users: {
                    select: {
                        id: true
                    }
                },
                Standings: {
                    select: {
                        userId: true
                    }
                },
                problems: true,
                points: true,
            }
        })
        if (!arena) return redirect('/')

        const standings = await db.standings.findFirst({
            where: {
                userId: session.user.id,
                arena: {
                    token: token
                }
            }
        })
        assert(!standings, "You have already resigned/ranked in this arena");
        const userSubmissions = await db.user.findFirst({
            where: {
                id: session.user.id,
            },
            select: {
                submissions: {
                    where: {
                        arena: {
                            token: token
                        }
                    },
                    select: {
                        problem: {
                            select: {
                                id: true,
                                difficulty: true
                            }
                        }
                    }
                }
            }
        });
        const difficultyValues = {
            Easy: 5,
            Medium: 10,
            Hard: 20,
        };
        // user not found for some weird fuckin reason
        if (!userSubmissions) return redirect('/')

        // [ { problem: { id: 1, difficulty: "Easy" } }, { problem: { id: 2, difficulty: "Medium" } }, { problem: { id: 3, difficulty: "Hard" } }, { problem: { id: 2, difficulty: "Medium" } } ]
        const UniqueSubmissions: { id: number, difficulty: "Easy" | "Medium" | "Hard" }[] = Array.from(new Set(userSubmissions.submissions.map(submission => JSON.stringify(submission.problem)))).map(e => JSON.parse(e));

        // [ { id: 1, difficulty: "Easy" }, { id: 2, difficulty: "Medium" }, { id: 3, difficulty: "Hard" } ]
        const accumulatedPoints = UniqueSubmissions.reduce((sum, submission) => {
            return sum + difficultyValues[submission.difficulty];
        }, 0)

        const standingsRes = await db.standings.create({
            data: {
                userId: session.user.id,
                arenaId: arena.id,
                resigned: true,
                points: accumulatedPoints ? accumulatedPoints : 0
            }
        });
        assert(standingsRes, "Failed to create standings");

        // +1 because of the resigned user, so we dont have to query the db again
        if (arena.Standings.length + 1 === arena.users.length) {
            await finishArena(token)
        }
        const res: Result = {
            score: accumulatedPoints,
            bestScore: arena.points,
            solved: UniqueSubmissions.length,
            solvedOutOf: arena.problems.length,
            token: token,
        }
        return res;
    }
    catch (error) {
        return false;
    }
}		
