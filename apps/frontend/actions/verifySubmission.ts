"use server";
import assert from "assert";
import { getServerSession } from "next-auth";
import db from "@/db";
import { authOptions } from "@/app/authConfig";

export default async function verifySubmission(submission_id: number, token: string) {
    const session = await getServerSession(authOptions);
    assert(session, "Session not found");
    try {
        await db.submission.update({
            where: {
                id: submission_id,
            },
            data: {
                userId: session.user.id,
            }
        })
        return true;
    } catch (error) {
        throw new Error("submission not found");
    }
}	
