import db from "../../../../../packages/db/src/"
export async function GET(request: Request) {
	await db.user.deleteMany({})
}
