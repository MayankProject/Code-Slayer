import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import handler from "@/app/authConfig"

export { handler as GET, handler as POST }
