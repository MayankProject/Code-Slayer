import { NextRequest } from "next/server";
import db from "@/db";
import { readFileSync } from "fs";
export async function GET() {
	let description = readFileSync("/home/sergio/Code/Code-Smack/apps/frontend/app/api/add/problems/twosum/description.md", "utf8")
	let testBoilerCode = readFileSync("/home/sergio/Code/Code-Smack/apps/frontend/app/api/add/problems/twosum/testBoilerCode.txt", "utf8")
	let boilerCode = readFileSync("/home/sergio/Code/Code-Smack/apps/frontend/app/api/add/problems/twosum/boiler.txt", "utf8")
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

	description = readFileSync("/home/sergio/Code/Code-Smack/apps/frontend/app/api/add/problems/sum/description.txt", "utf8")
	await db.problem.create(
		{
			data: {
				title: "Sum",
				difficulty: "Easy",
				TestCases: {
					create: [
						{
							input: "5\\n8\\n",
							output: "13",
						},
						{
							input: "4\\n3\\n",
							output: "7",
						},
						{
							input: "1\\n1\\n",
							output: "2",
						}
					]
				},
				boilerplate: `function sum(a, b) {

}`,
				testBiolerCode: `
const num1 = #INPUT_1#
const num2 = #INPUT_2#
const output = #OUTPUT#
const result = add(num1, num2)
if (output !== result){
	throw new Error(\`Test Case #i# Failed, Expected \${output} but got \${result} instead!\`)
				}`,
				description: description,
			}
		}

	)

	return new Response("ok")
}
