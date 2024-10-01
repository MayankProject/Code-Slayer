"use server";
import { getServerSession } from "next-auth";
import db from "../../../packages/db/src";
export default async function createArena(data: { name?: string }) {
	const session = await getServerSession();
	console.log(session);
	if (data.name) {
	}
}
