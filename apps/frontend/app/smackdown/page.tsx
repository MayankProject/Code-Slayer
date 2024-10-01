import Smackdown from "@/components/Smackdown";
import db from "../../../../packages/db/src";
import assert from "assert";
export default async function Page() {
  const problemDetails = await db.problem.findFirst({
    where: {
      id: 7
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
    <Smackdown problem={problemDetails} />
  )
}
