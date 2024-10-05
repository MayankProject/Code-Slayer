"use server";
import assert from "assert";
import { getServerSession } from "next-auth";
import db from "../../../packages/db/src";
import { authOptions } from "@/app/authConfig";
import RedisManager from "@/RedisManager";
const redis = RedisManager.getInstance();
export default async function startArena(token: string) {
	console.log("Starting arena", token)
	const session = await getServerSession(authOptions);
	assert(session, "Session not found");
	try {
		await db.arena.update({
			where: {
				token,
				admin: session?.user?.id,
			},
			data: {
				phase: "Battle",
			},
		});
	}
	catch (e) {
		throw new Error("Arena not found");
	}
	redis.publish(token, {
		e: "START_ARENA",
		id: token
	});

	return true;
}	
