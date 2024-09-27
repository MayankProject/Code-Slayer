import { NextRequest } from "next/server";
import db from "../../../../../packages/db/src/"
import { readFileSync } from "fs";
export async function GET(request: NextRequest) {
	const description = readFileSync("/home/sergio/Code/Code-Smack/apps/frontend/app/api/add/problems/twosum/description.md", "utf8")
	const testBoilerCode = readFileSync("/home/sergio/Code/Code-Smack/apps/frontend/app/api/add/problems/twosum/testBoilerCode.txt", "utf8")
	const boilerCode = readFileSync("/home/sergio/Code/Code-Smack/apps/frontend/app/api/add/problems/twosum/boiler.txt", "utf8")
	await db.problem.create(
		{
			data: {
				title: "Two Sum",
				difficulty: "Easy",
				TestCases: {
					create: [
						{
							input: "[2, 7, 11, 15]\\n9\\n",
							output: "[0, 1]",
						},
						{
							input: "[3, 2, 4]\\n6\\n",
							output: "[1, 2]",
						},
						{
							input: "[3, 3]\\n6\\n",
							output: "[0, 1]",
						}
					]
				},
				boilerplate: boilerCode,
				testBiolerCode: testBoilerCode,
				description: description,
			}
		}

	)
	return new Response("ok")
}
