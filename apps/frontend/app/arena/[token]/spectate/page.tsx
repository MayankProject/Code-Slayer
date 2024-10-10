import Spectate from "@/components/Spectate";
import db from "../../../../../../packages/db/src";
import assert from "assert";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/authConfig";
import { redirect } from "next/navigation";
export default async function Spec({ params: { token } }: { params: { token: string } }) {
	const session = await getServerSession(authOptions)
	assert(session, "Unauthenticated")

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
			users: {
				where: {
					NOT: {
						id: session.user.id
					}
				},
				select: {
					id: true,
					name: true,
				}
			},
			problems: {
				select: {
					problemId: true,
				}
			},
			phase: true
		}
	});

	assert(arena, "Arena not found");

	if (arena.phase === "Lobby") {
		return (
			redirect(`/arena/${token}`)
		);
	}

	// let the user pass if they have already resigned
	const userHasResigned = await db.standings.findFirst({
		where: {
			userId: session.user.id,
			arena: {
				token: token
			},
			resigned: true,
		}
	});

	if (userHasResigned) {
		return (
			<Spectate usersDetails={arena?.users} />
		);
	}

	// Restrict if user has not submitted in this arena at all
	if (!userWithSubmission) {
		return (
			redirect(`/arena/${token}/battle`)
		);
	}

	// Check if user has solved all problems in this arena
	const allSubmissions = userWithSubmission.submissions.map((submission) => {
		return submission.problemId;
	});
	const allProblems = arena.problems.map((problem) => {
		return problem.problemId;
	});
	const ifSolvedAllProblems = allProblems.every((problem) => {
		return allSubmissions.includes(problem);
	});

	// If user has not solved all problems in this arena
	if (!ifSolvedAllProblems) {
		return (
			redirect(`/arena/${token}/battle`)
		);
	}

	return (
		<Spectate usersDetails={arena?.users} />
	);
}
