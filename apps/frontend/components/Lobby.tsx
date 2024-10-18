"use client";
import { useSession } from "next-auth/react";
import JoinArena from "@/actions/join-arena";
import assert from "assert";
import { useEffect, useState } from "react";
import { WebSocketManager } from "@/WebsocketManager";
import { useRouter } from "next/navigation";
import startArena from "@/actions/start-arena";
import { toast } from "react-toastify";
import HangBall from "./Hang-ball";
import { allUsersState, loader, tokenState } from "@/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import leaveArena from "@/actions/leave-arena";
export interface User {
    name: string | null,
    id: number,
    admin: boolean,
    points: number | undefined,
    resigned: boolean | undefined
}
const ws = WebSocketManager.getInstance();
export default function Lobby({ data, status, token, totalPoints }: { data: User[], token: string, status: "Lobby" | "Battle", totalPoints: number }) {
    const [Users, setUser] = useRecoilState(allUsersState);
    const [isJoined, setIsJoined] = useState<boolean | undefined>(undefined);
    const session = useSession();
    const [isCopied, setIsCopied] = useState(false);
    const allUsersId = data.map((user) => user.id);
    const router = useRouter();
    const isAdmin = data.find((user) => user.id === session?.data?.user.id)?.admin;

    const setLoader = useSetRecoilState(loader);

    const userUpdateCallback = (message: any) => {
        if (message.userId === session?.data?.user.id) {
            return;
        }
        if (message.task === "JOIN_ARENA") {
            toast.success(`${message.name} joined the arena!`);
            setUser((Users) => [...Users, { name: message.name, id: message.userId, admin: false, points: undefined, resigned: undefined }]);
        }
        if (message.task === "LEAVE_ARENA") {
            toast.success(`${message.name} Left the arena!`);
            setUser((Users) => Users.filter((user) => user.id !== message.userId))
        }
    }

    const arenaStartingCallback = (message: any) => {
        assert(message.id === token, "Invalid token");
        if (!isAdmin) {
            toast.success("Arena started! Redirecting...");
            redirect();
        }
    }
    useEffect(() => {
        setUser(data)
        setLoader({ percentage: undefined });
    }, [])

    useEffect(() => {
        ws.attachCallback("USER_UPDATE", userUpdateCallback);
        return () => {
            ws.detachCallback("USER_UPDATE", userUpdateCallback);
        }
    }, [session])

    useEffect(() => {
        if (isJoined) {
            ws.attachCallback("START_ARENA", arenaStartingCallback);
            return () => {
                ws.detachCallback("START_ARENA", arenaStartingCallback);
            }
        }
    }, [isJoined]);

    if (session?.data?.user.id && isJoined === undefined) {
        setIsJoined(allUsersId.includes(session?.data?.user.id));
    }
    function redirect() {
        const randomNumber = Math.floor(Math.random() * (100 - 40) + 40);
        setLoader({ percentage: randomNumber });
        router.push(`/arena/${token}/battle`);
    }
    const _startArena = () => toast.promise(async () => {
        await startArena(token);
        redirect();
    }, {
        pending: "Starting Arena...",
        success: "Started! Redirecting...",
        error: "Oopsie Daisy! Something went wrong...",
    });
    const _JoinArena = () => toast.promise(new Promise(async (resolve) => {
        assert(session?.data, "Session not found");
        const userId = session?.data?.user.id;
        const name = session?.data?.user.name;
        const status = await JoinArena(token);
        setUser((Users) => [...Users, { name: name, id: userId, admin: false, points: undefined, resigned: undefined }]);
        assert(status, "Failed to join arena!");
        ws.attachCallback("START_ARENA", (message) => {
            assert(message.id === token, "Invalid token");
            redirect();
        });
        setIsJoined(true);
        resolve(true);
    }), {
        pending: "Joining...",
        success: "Joined!",
        error: "Oopsie Daisy! Something went wrong...",
    });

    const _LeaveArena = () => toast.promise(new Promise(async (resolve) => {
        assert(session?.data, "Session not found");
        const userId = session?.data?.user.id;
        const status = await leaveArena(token);
        const UpdatedUser = Users.filter((user) => user.id !== userId)
        setUser(UpdatedUser)
        assert(status, "Failed to leave arena!");
        ws.attachCallback("START_ARENA", (message) => {
            assert(message.id === token, "Invalid token");
            redirect();
        });
        setIsJoined(false);
        resolve(true);
    }), {
        pending: "Leaving Arena",
        success: "Left!",
        error: "Oopsie Daisy! Something went wrong...",
    });
    function copyLink() {
        try {
            navigator.clipboard.writeText(`${window.location.origin}/arena/${token}`);
        } catch (error) {
        }
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    return (
        <div className="p-3 h-1 w-full min-h-screen bg-gradient-to-br" >
            <div className="flex h-full w-full gap-3" >
                <div className="h-full w-1/4 flex flex-col gap-3" >
                    <div className="flex flex-col flex-1 gap-2 backdrop-blur-xl border rounded-lg p-3 border-gray-500/20" >
                        {
                            Users.map((user, rank) => {
                                return (
                                    <div key={user.id} className="border flex justify-between hover:scale-x-[1.01] transition-all rounded-lg px-6 py-3 bg-[#111111] border-gray-500/20" >
                                        <div className="flex gap-2" >

                                            {session?.data?.user.id === user.id && <div className="text-gray-400" > 👤 </div>
                                            }
                                            {user.name}

                                        </div>
                                        < div className="flex gap-2 items-center" >
                                            <span className="text-gray-400 " >
                                                ({user.points ?? 0} / {totalPoints})
                                            </span>
                                            {
                                                user.resigned !== undefined && <div className="text-gray-400" >
                                                    {
                                                        user.resigned ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5" >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                                                            </svg>
                                                            : `#${rank + 1} `
                                                    } </div>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        isJoined === false && <div
                            onClick={_JoinArena}
                            className="bg-[#111111] hover:scale-x-[1.01] transition-all text-center p-3 w-full rounded-lg cursor-pointer border-[#2CBB5D] border" >
                            Join
                        </div>
                    }
                    {
                        isJoined === true && !isAdmin && <div
                            onClick={_LeaveArena}
                            className="bg-[#111111] hover:scale-x-[1.01] transition-all text-center p-3 w-full rounded-lg cursor-pointer border-destructive border" >
                            Leave Arena
                        </div>
                    }
                    {
                        isJoined === true && status === "Battle" && <div
                            onClick={
                                () => {
                                    router.push(`/arena/${token}/battle`)
                                }
                            }
                            className="bg-[#111111] hover:scale-x-[1.01] transition-all text-center p-3 w-full rounded-lg cursor-pointer border border-[#BD3F19]" >
                            Go To Battle!
                        </div>
                    }
                    {

                        isAdmin && status === "Lobby" &&
                        <div className="flex gap-2 " >
                            <div
                                onClick={_startArena}
                                className="bg-[#111111] flex-1 hover:scale-x-[1.01] transition-all text-center p-3 w-full rounded-lg cursor-pointer border-[#2CBB5D] border" >
                                Start

                            </div>
                            <div className={
                                `relative border cursor-pointer flex items-center hover:bg-[#1e1e1e] border-[#1e1e1e] transition-200  px-4 py-[4px] rounded-lg  text-gray-400`
                            }
                                onClick={copyLink}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" onClick={copyLink} strokeWidth={1.5} stroke="currentColor" className={`size-5  cursor-pointer hover:scale-[1.1] transition-all ${isCopied ? "stroke-green-500" : "stroke-gray-400"}`} >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                </svg>
                            </div
                            >
                        </div>
                    }
                </div>
                < div className="h-full w-3/4 flex flex-col gap-3" >
                    <div className="flex items-center gap-3 backdrop-blur-xl border text-sm rounded-lg px-6 text-gray-400 py-3 border-gray-500/20" >
                        <div className="flex gap-2 items-center" >
                            {status === "Lobby" ?
                                <>
                                    <div className="w-2 h-2 bg-orange-500 rounded-full" > </div>
                                    Waiting for players
                                </> : <>
                                    < div className="w-2 h-2 bg-[#2CBB5D] rounded-full" > </div>
                                    Battling!
                                </>}
                        </div>
                        |
                        <div className="flex gap-2 items-center" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" onClick={copyLink} strokeWidth={1.5} stroke="currentColor" className={`size-5  cursor-pointer hover:scale-[1.1] transition-all ${isCopied ? "stroke-green-500" : "stroke-gray-400"}`} >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>
                            <p>
                                {isCopied ? "Copied!" : "Copy the link and share it with your friends!"}
                            </p>
                        </div>
                    </div>
                    < div className="flex justify-center items-center flex-1 backdrop-blur-xl border text-sm rounded-lg text-gray-400 border-gray-500/20" >
                        <HangBall />
                    </div>
                </div>
            </div>
        </div >
    )
}
