"use server"
import db from "@/db";
export default async (id: number) => {
	const user = await db.user.findFirst({ where: { id: id } });
	if (user) return true;
	return false;
};
