import { NextRequest } from "next/server";
import db from "@/db";
import "dotenv/config";
import assert from "assert";

export async function POST(req: NextRequest) {
    try {
        const payload: {
            workerSecretKey: string;
            token: string;
        } = await req.json();

        if (payload.workerSecretKey !== process.env.WORKER_SECRET_KEY) {
            return new Response("Unauthorized");
        }

        const arena = await db.arena.findFirst({
            where: {
                token: payload.token
            },
            select: {
                timeLimit: true
            }
        })
        assert(arena, "arena doesn't exist")
        return Response.json({ timeLimit: arena.timeLimit });
    } catch (e) {
        return new Response("Something went wrong", { status: 500 });
    }
}
