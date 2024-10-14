import { timeState } from "@/state";
import { WebSocketManager } from "@/WebsocketManager";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const ws = WebSocketManager.getInstance();
export default function Time({ timeLimit }: { timeLimit: number }) {
    const [time, setTime] = useRecoilState(timeState);

    const timeUpdateCallback = (time: { time: number }) => {
        setTime(time.time);
    };
    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Add leading zeros to minutes and seconds if needed
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }
    useEffect(() => {
        setTime(timeLimit)
        setInterval(() => {
            setTime(time => time - 1);
        }, 1000);
        ws.attachCallback("TIME_CONTROL", timeUpdateCallback);
        return () => {
            ws.detachCallback("TIME_CONTROL", timeUpdateCallback);
        }
    }, []);
    return (
        <div className= {`relative flex items-center gap-3 border hover:bg-[#1e1e1e] border-[#1e1e1e] transition-200 my-2 px-4 py-[4px] rounded-lg  text-gray-400`
}>
    <svg xmlns="http://www.w3.org/2000/svg" fill = "none" viewBox = "0 0 24 24" strokeWidth = { 1.5} stroke = "currentColor" className = "size-6" >
        <path strokeLinecap="round" strokeLinejoin = "round" d = "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            < h1 className = "text-2xl font-bold text-white" > { formatTime(time) } </h1>
                </div>
    )
;
}
