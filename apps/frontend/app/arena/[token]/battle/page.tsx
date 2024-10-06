import { getServerSession } from "next-auth";
import db from "../../../../../../packages/db/src";
import { authOptions } from "@/app/authConfig";
import assert from "assert";
import Smackdown from "@/components/Smackdown";
import { redirect } from "next/navigation";
export default async function Battle({ params: { token } }: { params: { token: string } }) {
	const session = await getServerSession(authOptions)
	assert(session, "Unauthenticated");
	const userId = session.user.id;

	const arena = await db.arena.findFirst({
		where: {
			token,
		},
		select: {
			phase: true,
			timeLimit: true,
		},
	});

	assert(arena, "No arena found");

	if (arena.phase === "Lobby") {
		return redirect("/arena/" + token);
	}

	const problems = await db.arena.findFirst({
		where: {
			token: token,
			users: {
				some: {
					id: userId
				}
			}
		},
		select: {
			problems: {
				select: {
					problem: {
						select: {
							id: true,
							title: true,
							description: true,
							difficulty: true,
							boilerplate: true
						}
					}
				}
			}
		}
	});
	assert(problems, "No battle found");
	const parsedProblems = problems?.problems.map(problem => problem.problem);
	console.log(parsedProblems);
	return (
		<Smackdown token= { token } problemsData = { parsedProblems } timeLimit = { arena.timeLimit } />
	)
}
