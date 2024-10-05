"use server";
import assert from "assert";
import { getServerSession } from "next-auth";
import db from "../../../packages/db/src";
import { authOptions } from "@/app/authConfig";

export default async function verifySubmission(submission_id: number) {
	const session = await getServerSession(authOptions);
	assert(session, "Session not found");
	console.log(submission_id);
	const submission = await db.submission.update({
		where: {
			id: submission_id,
		},
		data: {
			userId: session.user.id,
		}
	})
	return true
}	
