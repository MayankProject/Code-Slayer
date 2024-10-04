"use server";
import { getServerSession } from "next-auth";
import db from "../../../packages/db/src";
import { authOptions } from "@/app/authConfig";
import assert from "assert";
export default async function joinArena(token: string) {
	const session = await getServerSession(authOptions);
	assert(session, "Session not found");
	const userId = session.user.id;
	await db.arena.update({
		where: {
			token: token,
		},
		data: {
			users: {
				connect: {
					id: userId,
				},
			},
		},
	});
	return true;
}
