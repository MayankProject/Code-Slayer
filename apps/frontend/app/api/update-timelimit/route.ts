import { NextRequest } from "next/server";
import db from "@/db";
import "dotenv/config";
import assert from "assert";

export async function POST(req: NextRequest) {
	try {
		const payload: {
			workerSecretKey: string;
			token: string;
			timeLimit: number;
		} = await req.json();

		if (payload.workerSecretKey !== process.env.WORKER_SECRET_KEY) {
			return new Response("Unauthorized");
		}

		const arena = await db.arena.update({
			where: {
				token: payload.token
			},
			data: {
				timeLimit: payload.timeLimit
			}
		})
		assert(arena, "arena doesn't exist")
		return Response.json("Ok");
	} catch (e) {
		console.error(e);
		return new Response("Something went wrong", { status: 500 });
	}
}
