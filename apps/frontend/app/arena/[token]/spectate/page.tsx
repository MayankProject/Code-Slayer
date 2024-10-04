import Spectate from "@/components/Spectate";
import db from "../../../../../../packages/db/src";
import assert from "assert";
export default async function({ params: { token } }: { params: { token: string } }) {
	const users = await db.arena.findFirst({
		where: {
			token: token
		},
		select: {
			users: {
				select: {
					id: true,
					name: true,
				}
			}
		}
	});
	assert(users, "User not found");
	console.log(users);
	return (
		<Spectate usersDetails= { users?.users } />
	);
}
