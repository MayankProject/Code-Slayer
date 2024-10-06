"use server";
import assert from "assert";
import { getServerSession } from "next-auth";
import db from "../../../packages/db/src";
import { authOptions } from "@/app/authConfig";
import { redirect } from "next/navigation";

export default async function verifySubmission(submission_id: number, token: string) {
	const session = await getServerSession(authOptions);
	assert(session, "Session not found");
	try {
		const submission = await db.submission.update({
			where: {
				id: submission_id,
			},
			data: {
				userId: session.user.id,
			}
		})
	} catch (error) {
		throw new Error("submission not found");
	}

	// Check if user has solved all problems in this arena
	const userWithSubmission = await db.user.findFirst({
		where: {
			id: session.user.id,
			submissions: {
				some: {
					arena: {
						token: token
					}
				}
			}
		},
		select: {
			submissions: {
				where: {
					arena: {
						token: token
					}
				},
				select: {
					problemId: true,
				}
			}
		}
	});

	const arena = await db.arena.findFirst({
		where: {
			token: token
		},
		select: {
			id: true,
			problems: {
				select: {
					problemId: true,
				}
			},
			Standings: {
				select: {
					id: true,
				}
			}
		}
	});

	if (userWithSubmission && arena) {
		const allSubmissions = userWithSubmission.submissions.map((submission) => {
			return submission.problemId;
		});
		const allProblems = arena.problems.map((problem) => {
			return problem.problemId;
		});
		const solvedAllProblems = allProblems.every((problem) => {
			return allSubmissions.includes(problem);
		});
		if (solvedAllProblems) {
			const prevStandings = arena.Standings.length;
			try {
				await db.standings.create({
					data: {
						userId: session.user.id,
						arenaId: arena.id,
						rank: prevStandings + 1,
					}
				});
				return { standings: prevStandings + 1 };
			} catch (error) {
				console.log("Failed to create standings");
			}
		}
	}
	return false;
}	
