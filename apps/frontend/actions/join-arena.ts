"use server";
import { getServerSession } from "next-auth";
import db from "@/db";
import { authOptions } from "@/app/authConfig";
import RedisManager from "@/RedisManager";
import { redirect } from "next/navigation";
const redis = RedisManager.getInstance();
export default async function joinArena(token: string) {
    const session = await getServerSession(authOptions);
    if(!session){
        return redirect("/")
    }
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
        e: "USER_UPDATE",
        task: "JOIN_ARENA",
        userId: userId,
        name: session.user.name,
    });

    return true;
}
