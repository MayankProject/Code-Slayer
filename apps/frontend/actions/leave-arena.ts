"use server";
import { getServerSession } from "next-auth";
import db from "@/db";
import { authOptions } from "@/app/authConfig";
import RedisManager from "@/RedisManager";
import { redirect } from "next/navigation";
const redis = RedisManager.getInstance();

export default async function leaveArena(token: string) {
    const session = await getServerSession(authOptions);
    if(!session){
        return redirect("/")
    }
    const userId = session.user.id;
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
        if(!session){
            return redirect("/")
        }
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
