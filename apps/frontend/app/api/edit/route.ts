import { NextRequest } from "next/server";
import db from "../../../../../packages/db/src/"

import { readFileSync } from "fs";
export async function GET(request: NextRequest) {
	const description = readFileSync("/home/sergio/Code/Code-Smack/apps/frontend/app/api/add/problems/sum/description.txt", "utf8")
	const problem = await db.problem.update({
		where: {
			id: 1
		},
		data: {
			description: description,
		}

	})
	return new Response("ok")
}
