"use server";
import { getServerSession } from "next-auth";
import db from "../../../packages/db/src";
import { authOptions } from "@/app/authConfig";
export default async function createArena() {
	const token = Math.random().toString(36).substring(2, 7);
	const session = await getServerSession(authOptions);
	if (!session) {
		throw new Error("Not logged in!");
	}
	try {
		const problems = await db.problem.findMany();
		const shuffledProblems = problems.sort(() => 0.5 - Math.random());
		const selectedProblems = shuffledProblems.slice(0, 2).map((problem) => {
			return {
				problemId: problem.id,
			}
		})
		await db.arena.create({
			data: {
				description: "",
				duration: 60,
				token: token,
				startTime: new Date(),
				endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
				problems: {
					createMany: {
						data: selectedProblems,
					}
				},
				users: {
					connect: {
						id: session.user.id,
					}
				},
				admin: session.user.id
			}
		})
		return token;
	}
	catch (e) {
		throw new Error("Could not create arena");
	}
}
