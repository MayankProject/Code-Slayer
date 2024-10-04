import Smackdown from "@/components/Smackdown";
import db from "../../../../../../../packages/db/src";
import assert from "assert";
export default async function Page({ params: { problemId } }: { params: { problemId: string } }) {
	const problemDetails = await db.problem.findFirst({
		where: {
			id: parseInt(problemId),
		},
		select: {
			id: true,
			title: true,
			description: true,
			difficulty: true,
			boilerplate: true,
		}
	})
	assert(problemDetails, "Problem not found");
	return (
		<Smackdown problem= { problemDetails } />
  )
}
