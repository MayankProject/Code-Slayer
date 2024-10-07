"use server";
import { getServerSession } from "next-auth";
import db from "../../../packages/db/src";
import { authOptions } from "@/app/authConfig";
import assert from "assert";
import RedisManager from "@/RedisManager";

const redis = RedisManager.getInstance();
export default async function resign(token: string) {
	const session = await getServerSession(authOptions);
	assert(session, "Session not found");
	try {
		// Cant resign if you have standing in this arena
		const arena = await db.arena.findFirst({
			where: {
				token: token
			},
			select: {
				id: true,
				users: {
					select: {
						id: true
					}
				},
				Standings: {
					select: {
						userId: true
					}
				}
			}
		})
		assert(arena, "Arena not found");

		const standings = await db.standings.findFirst({
			where: {
				userId: session.user.id,
				arena: {
					token: token
				}
			}
		})
		assert(!standings, "You have already resigned/ranked in this arena");

		const standingsRes = await db.standings.create({
			data: {
				userId: session.user.id,
				arenaId: arena.id,
				rank: 0,
				resigned: true
			}
		});
		assert(standingsRes, "Failed to create standings");

		// +1 because of the resigned user, so we dont have to query the db again
		if (arena.Standings.length + 1 === arena.users.length) {
			await db.arena.update({
				where: {
					id: arena.id
				},
				data: {
					phase: "Lobby"
				}
			});
			redis.publish(
				token,
				{
					e: "FINISH_ARENA",
				}
			)
		}

		return true;
	}
	catch (error) {
		return false;
	}
}		
