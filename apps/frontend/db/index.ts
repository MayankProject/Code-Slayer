import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { withAccelerate } from '@prisma/extension-accelerate'

// Load environment variables from .env file
dotenv.config();

const prismaClientSingleton = () => {
	return new PrismaClient().$extends(withAccelerate());
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Declare a global type for Prisma to use in development to avoid multiple instances
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined;
};

// Create the `prisma` instance based on the environment
let prisma: PrismaClientSingleton;

if (process.env.NODE_ENV === "production") {
	// In production, create a new PrismaClient for each invocation
	prisma = prismaClientSingleton();
} else {
	// In development, reuse the existing instance attached to globalThis
	if (!globalForPrisma.prisma) {
		globalForPrisma.prisma = prismaClientSingleton();
	}
	prisma = globalForPrisma.prisma;
}

export default prisma;
