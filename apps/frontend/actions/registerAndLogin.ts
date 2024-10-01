import { signIn, useSession } from "next-auth/react";
import register from "./register";
export default async () => {
	const { username, password } = await register();
	await signIn("credentials", {
		redirect: false,
		username,
		password,
	});
};
