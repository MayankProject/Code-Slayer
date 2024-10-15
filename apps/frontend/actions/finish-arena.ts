"use server";
import db from "@/db"
import RedisManager from "@/RedisManager";
const redis = RedisManager.getInstance()
export default async function finishArena(token: string) {
    const arena = await db.arena.update({
        where: {
            token: token,
        },
        data: {
            phase: "Lobby"
        },
        select: {
            users: {
                select: {
                    id: true,
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
            },
            Standings: {
                select: {
                    userId: true,
                }
            },
            id: true
        }
    })
    console.log(arena)
    const usersNotInStandings = arena.users.filter(user => !arena.Standings.some(standing => standing.userId === user.id))

    const difficultyValues = {
        Easy: 5,
        Medium: 10,
        Hard: 20,
    };
    const createStandingData: {
        userId: number,
        resigned: boolean,
        points: number
    }[] = []
    console.log(usersNotInStandings)
    usersNotInStandings.forEach((user) => {
        console.log(user.submissions)
        const UniqueSubmissions: { id: number, difficulty: "Easy" | "Medium" | "Hard" }[] = Array.from(new Set(user.submissions.map(submission => JSON.stringify(submission.problem)))).map(e => JSON.parse(e));
        console.log(UniqueSubmissions)
        const accumulatedPoints = UniqueSubmissions.reduce((sum, submission) => {
            return sum + difficultyValues[submission.difficulty];
        }, 0)
        createStandingData.push({
            userId: user.id,
            resigned: true,
            points: accumulatedPoints ? accumulatedPoints : 0
        })
    })
    await db.arena.update({
        where: {
            token: token,
        },
        data: {
            Standings: {
                createMany: {
                    data: createStandingData
                }
            }
        }
    })
    redis.publish(
        token,
        {
            e: "FINISH_ARENA",
        }
    )
}
