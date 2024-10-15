import Lobby from "@/components/Lobby";
import db from "@/db";
import assert from "assert";
export default async function Arena({ params: { token } }: { params: { token: string } }) {
    const arenaDetails = await db.arena.findFirst({
        where: {
            token: token,
        },
        select: {
            users: {
                select: {
                    name: true,
                    id: true
                }
            },
            admin: true,
            phase: true,
            points: true
        },

    });
    assert(arenaDetails, "Arena not found");
    const standings = await db.standings.findMany({
        where: {
            arena: {
                token: token
            }
        },
        select: {
            userId: true,
            points: true,
            resigned: true
        },
    });
    const standingsMap = new Map(standings.map((standing) => [standing.userId, { points: standing.points, resigned: standing.resigned }]));
    const arenaUsers = arenaDetails.users.map((user) => {
        const standings = standingsMap.get(user.id);
        return {
            ...user, admin: arenaDetails.admin === user.id, points: standings?.points, resigned: standings?.resigned
        }
    })
    const sortedByPoints = arenaUsers.sort((a, b) => (b.points || 0) - (a.points || 0));
    return (
        <Lobby data={sortedByPoints} totalPoints={arenaDetails.points} status={arenaDetails.phase} token={token} />
    );
}
