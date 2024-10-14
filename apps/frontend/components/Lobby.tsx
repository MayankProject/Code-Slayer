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
    rank: number | undefined
}
const ws = WebSocketManager.getInstance();
export default function Lobby({ data, status, token }: { data: User[], token: string, status: "Lobby" | "Battle" }) {
    const setTokenState = useSetRecoilState(tokenState);
    const [Users, setUser] = useRecoilState(allUsersState);
    const [isJoined, setIsJoined] = useState<boolean | undefined>(undefined);
    const session = useSession();
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
            setUser((Users) => [...Users, { name: message.name, id: message.userId, admin: false, rank: undefined }]);
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
        setTokenState(token);
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
        setUser((Users) => [...Users, { name: name, id: userId, admin: false, rank: undefined }]);
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

    return (
        <div className="p-3 h-1 w-full min-h-screen bg-gradient-to-br" >
            <div className="flex h-full w-full gap-3" >
                <div className="h-full w-1/4 flex flex-col gap-3" >
                    <div className="flex flex-col flex-1 gap-2 backdrop-blur-xl border rounded-lg p-3 border-gray-500/20" >
                        {
                            Users.map((user) => {
                                return (
                                    <div key={user.id} className="border flex justify-between hover:scale-x-[1.01] transition-all rounded-lg px-6 py-3 bg-[#111111] border-gray-500/20" >
                                        <div className="flex gap-2" >
                                            {user.name}
                                            {session?.data?.user.id === user.id && <div className="text-gray-400" > (You) </div>}
                                        </div>
                                        {
                                            user.rank !== undefined && <div className="text-gray-400" > {user.rank === 0 ? "( resigned )" : `( #${user.rank} )`} </div>
                                        }
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
                        <div
                            onClick={_startArena}
                            className="bg-[#111111] hover:scale-x-[1.01] transition-all text-center p-3 w-full rounded-lg cursor-pointer border-[#2CBB5D] border" >
                            Start
                        </div>

                    }
                </div>
                < div className="h-full w-3/4 flex flex-col gap-3" >
                    <div className="flex backdrop-blur-xl border text-sm rounded-lg px-6 text-gray-400 py-3 border-gray-500/20" >
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
                    </div>
                    < div className="flex justify-center items-center flex-1 backdrop-blur-xl border text-sm rounded-lg text-gray-400 border-gray-500/20" >
                        <HangBall />
                    </div>
                </div>
            </div>
        </div >
    )
}
