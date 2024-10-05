import Spectate from "@/components/Spectate";
import db from "../../../../../../packages/db/src";
import assert from "assert";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/authConfig";
import { redirect } from "next/navigation";
export default async function({ params: { token } }: { params: { token: string } }) {
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
	if (!userWithSubmission) {
		return (
			redirect(`/arena/${token}/battle`)
		);
	}

	const arena = await db.arena.findFirst({
		where: {
			token: token
		},
		select: {
			users: {
				select: {
					id: true,
					name: true,
				}
			},
			problems: {
				select: {
					problemId: true,
				}
			}
		}
	});

	assert(arena, "Arena not found");

	const allSubmissions = userWithSubmission.submissions.map((submission) => {
		return submission.problemId;
	});
	const allProblems = arena.problems.map((problem) => {
		return problem.problemId;
	});
	const ifSolvedAllProblems = allProblems.every((problem) => {
		return allSubmissions.includes(problem);
	});

	assert(ifSolvedAllProblems, "You haven't solved all the problems in this arena");

	return (
		<Spectate usersDetails= { arena?.users } />
	);
}
