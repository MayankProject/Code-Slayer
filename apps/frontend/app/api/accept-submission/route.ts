import { NextRequest } from "next/server";
import db from "@/db";
import "dotenv/config";

export async function POST(req: NextRequest) {
    try {
        const payload: {
            token: string;
            code: string;
            language: string;
            time: number;
            memory: number;
            status: string;
            problemId: number;
            workerSecretKey: string;
        } = await req.json();

        if (payload.workerSecretKey !== process.env.WORKER_SECRET_KEY) {
            return new Response("Unauthorized");
        }
        const arena = await db.arena.findFirst({
            where: {
                token: payload.token,
            },
            select: {
                id: true,
            }
        })
        if (!arena) {
            throw new Error("Arena not found");
        }

        const submissionId = await db.submission.create({
            data: {
                code: payload.code,
                language: "javascript",
                time: payload.time,
                memory: payload.memory,
                status: "Accepted",
                problemId: payload.problemId,
                arenaId: arena.id,
            }
        })
        if (!submissionId) {
            throw new Error("Submission not found");
        }
        return Response.json({ id: submissionId.id });
    } catch (e) {
        console.error(e);
        return new Response("Something went wrong", { status: 500 });
    }
}
