import Lobby from "@/components/Lobby";
import db from "../../../../../packages/db/src";
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
		}
	});
	assert(arenaDetails, "Arena not found");
	const arenaUsers = arenaDetails.users.map((user) => {
		return {
			...user, admin: arenaDetails.admin === user.id
		}
	})
	return (
		<Lobby data={arenaUsers} token={token} />
	);
}
