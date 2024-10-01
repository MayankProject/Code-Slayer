"use server";
import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";
import db from "../../../packages/db/src";
export default async function() {
	const randomUsername = Math.random().toString(36).substr(2, 8);
	const randomPassword = Math.random().toString(36).substr(2, 8);
	const user = await db.user.create({
		data: {
			username: randomUsername,
			password: randomPassword
		},
	});
	if (!user) {
		throw new Error("Failed to create user");
	}
	return { username: user.username, password: user.password }
	// If registration is successful, sign in the user automatically

}
