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

	const arena = await db.arena.findFirst({
		where: {
			token,
			admin: session?.user?.id,
		}
	});
	assert(arena, "Arena not found");
	console.log(`Arena ${token} started`);
	redis.publish(token, {
		e: "START_ARENA",
		id: token
	});

	return true;
}	
