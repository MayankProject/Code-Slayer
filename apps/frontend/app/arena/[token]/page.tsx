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
			phase: true
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
			rank: true,
		}
	});
	const standingsMap = new Map(standings.map((standing) => [standing.userId, standing.rank]));
	const arenaUsers = arenaDetails.users.map((user) => {
		return {
			...user, admin: arenaDetails.admin === user.id, rank: standingsMap.get(user.id)
		}
	})
	return (
		<Lobby data={arenaUsers} status={arenaDetails.phase} token={token} />
	);
}
