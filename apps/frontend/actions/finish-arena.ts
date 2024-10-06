"use server";
import db from "../../../packages/db/src";

export default async function finishArena(token: string) {
	await db.arena.update({
		where: {
			token: token,
		},
		data: {
			phase: "Lobby"
		}
	})
}
