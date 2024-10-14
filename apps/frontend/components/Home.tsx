"use client";
import createArena from "@/actions/create-arena";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { loader } from "@/state";

export default function Home() {
    const router = useRouter();
    const [arenaCode, setArenaCode] = useState("");
    const joinArena = () => {
        router.push(`/arena/${arenaCode}`);
    }
    const [_loader, setLoader] = useRecoilState(loader);
    useEffect(() => {
        if (_loader.percentage !== undefined && _loader.percentage > 0) {
            setLoader({ percentage: undefined });
        }
    }, []);
    const handleArenaCreation = () => toast.promise(async () => {
        const token = await createArena();
        const randomNumber = Math.floor(Math.random() * (100 - 40) + 40);
        setLoader({ percentage: randomNumber });
        router.push(`/arena/${token}`);
    }, {
        pending: "Creating Arena...",
        success: "Created! Redirecting...",
        error: "Oopsie Daisy! Something went wrong...",
    });
    return (
        <div className="p-3 h-1 w-full min-h-screen bg-red" >
            <div className="h-full flex flex-col gap-4 justify-center items-center" >
                <div className="flex gap-2 w-full h-full jusitfy-center" >
                    <div className="flex flex-col gap-2 justify-center w-full items-center" >
                        <div className="backdrop-blur-xl border border-gray-500/20  p-8 rounded-3xl px-16 py-28" >
                            <h1 className="my-2 text-6xl font-bold text-white" > Code Slayer </h1>
                            < div className="text-gray-400 text-xl " > LeetCode But Multiplayer(Sort of) </div>
                            < div className="partition w-full h-1 border-gray-800 my-5 border-b" />
                            <ol className="text-xl leading-8 kanit-regular" >
                                <li>- Create an Arena </li>
                                < li > - Gather some friends < span className="text-sm" > (Bold of me to assume you have any )</span></li >
                                <li>-  Start the battle! </li>
                                < li > -  Submit your code or Resign </li>
                                < li > -  Spectate the battle </li>
                                < li > -  Leaderboards </li>
                            </ol>
                        </div>
                    </div>

                    < div className="w-full h-full flex flex-col justify-center items-center" >
                        <div className="w-full max-w-[30rem] flex flex-col p-6 items-center justify-center" >
                            <div className="flex flex-col gap-2 w-full rounded-md" >
                                <input type="text" value={arenaCode} onChange={(e) => setArenaCode(e.target.value)
                                } placeholder="Room Code Here" className="w-full outline-none bg-transparent  border-b p-2" />
                                <button
                                    onClick={joinArena}
                                    className={`relative bg-black text-white border border-gray-500/20 transition-200 my-2 px-4 py-3 rounded-lg flex-1`}>
                                    Join Arena
                                </button>
                            </div>
                            < div className="parition bg-gray-800 h-[2px] w-[80px] my-[2px]" >
                            </div>
                            < button
                                onClick={handleArenaCreation}
                                className={`relative text-white w-full bg-black border border-gray-500/20 rounded-xl transition-200 my-2 px-4 py-3`}>
                                Create Arena
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}
