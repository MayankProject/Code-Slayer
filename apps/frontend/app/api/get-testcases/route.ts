import { NextRequest } from "next/server";
import db from "@/db";
import "dotenv/config";
import assert from "assert";

export async function POST(req: NextRequest) {
    try {
        const payload: {
            workerSecretKey: string;
            id: number,
        } = await req.json();
        if (payload.workerSecretKey !== process.env.WORKER_SECRET_KEY) {
            return new Response("Unauthorized");
        }

        const problem = await db.problem.findFirst({
            where: {
                id: payload.id,
            },
            select: {
                TestCases: true,
                testBiolerCode: true,
            }
        })
        assert(problem, "Problem Does not exist")
        return Response.json({ TestCases: problem.TestCases, testBoilerCode: problem.testBiolerCode });
    } catch (e) {
        console.error(e);
        return new Response("Something went wrong", { status: 500 });
    }
}
