import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const user = await db.user.findUnique({
                    where: { username: credentials?.username },
                });

                if (user && credentials?.password && user.password === credentials.password) {
                    return { id: user.id, name: user.name, username: user.username } as any;
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as number;
            return session;
        },
    },
}

export default NextAuth(authOptions);
