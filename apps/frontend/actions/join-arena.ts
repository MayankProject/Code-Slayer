"use server";
import { getServerSession } from "next-auth";
import db from "../../../packages/db/src";
import { authOptions } from "@/app/authConfig";
import assert from "assert";
import RedisManager from "@/RedisManager";
const redis = RedisManager.getInstance();
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

	redis.publish(token, {
		e: "JOIN_ARENA",
		userId: userId,
		name: session.user.name,
	});

	return true;
}
