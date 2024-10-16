import { NextRequest } from "next/server";
import "dotenv/config";
import finishArena from "@/actions/finish-arena";
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
		await finishArena(payload.token)
		return Response.json("ok");
	} catch (e) {
		return new Response("Something went wrong", { status: 500 });
	}
}
