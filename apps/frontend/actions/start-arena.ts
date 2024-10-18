"use server";
import { getServerSession } from "next-auth";
import db from "@/db";
import { authOptions } from "@/app/authConfig";
import RedisManager from "@/RedisManager";
import { redirect } from "next/navigation";

const redis = RedisManager.getInstance();
export default async function startArena(token: string) {
    const session = await getServerSession(authOptions);
    if (!session) return redirect("/")
    try {
        // finish arena if it is already started
        redis.push('finish_arena', {
            token,
        });
        const arena = await db.arena.update({
            where: {
                token,
                admin: session.user.id,
            },
            data: {
                phase: "Battle",
            },
        });
        await db.arena.update({
            where: {
                token,
            },
            data: {
                timeLimit: arena.duration
            },
        });
        await db.standings.deleteMany({
            where: {
                arena: {
                    token,
                    admin: session.user.id,
                }
            },
        });
        await db.submission.deleteMany({
            where: {
                arena: {
                    token,
                    admin: session.user.id,
                }
            },
        });
        redis.publish(token, {
            e: "START_ARENA",
            id: token
        });
        console.log("pushing");
        redis.push('start_arena', {
            token,
        });
    }
    catch (e) {
        throw new Error("Arena not found");
    }
    return true;
}	
