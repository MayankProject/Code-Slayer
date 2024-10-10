"use server";
import { getServerSession } from "next-auth";
import db from "../../../packages/db/src";
import { authOptions } from "@/app/authConfig";
import assert from "assert";
import RedisManager from "@/RedisManager";
const redis = RedisManager.getInstance();

export default async function leaveArena(token: string) {
	const session = await getServerSession(authOptions);
	assert(session, "Session not found");
	const userId = session.user.id;
	console.log(" Leave arena");
	try {
		const arena = await db.arena.update({
			where: {
				token: token,
				users: {
					some: {
						id: userId
					}
				}
			},
			data: {
				users: {
					disconnect: {
						id: userId,
					},
				},
			},
		});
		assert(arena, "Arena not found");
		redis.publish(token, {
			e: "USER_UPDATE",
			task: "LEAVE_ARENA",
			userId: userId,
			name: session.user.name,
		});
	} catch (e) {
		console.error("cant");
	}

	return true;
}
