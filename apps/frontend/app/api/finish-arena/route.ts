import { NextRequest } from "next/server";
import db from "@/db";
import "dotenv/config";
import RedisManager from "@/RedisManager";
import finishArena from "@/actions/finish-arena";
const redis = RedisManager.getInstance()

export async function POST(req: NextRequest) {
	try {
		const payload: {
			workerSecretKey: string;
			token: string
		} = await req.json();
		console.log(payload, process.env.WORKER_SECRET_KEY)
		if (payload.workerSecretKey !== process.env.WORKER_SECRET_KEY) {
			return new Response("Unauthorized");
		}
		console.log("here")
		finishArena(payload.token)
		return Response.json("ok");
	} catch (e) {
		return new Response("Something went wrong", { status: 500 });
	}
}
