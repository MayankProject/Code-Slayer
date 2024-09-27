"use client"
import { Button } from "./ui/button"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { SessionContextValue } from "next-auth/react"
import { signIn } from "next-auth/react"
import { signOut } from "next-auth/react"
export function Navigation() {
    const session: SessionContextValue = useSession()
    useEffect(() => {
    }, [session])

    return (
        <nav className="px-[5rem] flex justify-between items-center py-2 border-white w-full" >
            <div className="logo text-brand-orange text-3xl" > Logo </div>
            {session.data ? (
                <div className="flex items-center gap-4">
                    <div className="text-brand-orange text-xl"> Hi, {session.data.user?.name} </div>
                    <Button onClick={() => signOut()}>
                        Logout
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <Button onClick={() => signIn("credentials")}>
                        Login
                    </Button>
                </div>
            )}
        </nav>
    )
}
