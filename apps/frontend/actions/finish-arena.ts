"use server";
import db from "@/db"
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
