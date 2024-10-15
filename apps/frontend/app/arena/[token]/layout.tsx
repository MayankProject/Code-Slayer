"use client";
import ReportComponent from "@/components/ReportComponent";
import { resultDataState, showResultState } from "@/state";
import { WebSocketManager } from "@/WebsocketManager";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Result } from "@/components/Smackdown";
const ws = WebSocketManager.getInstance();
export default function Layout({ children, params: { token } }: { children: React.ReactNode, params: { token: string } }) {
    const router = useRouter()
    const setResult = useSetRecoilState(resultDataState)
    const setShowResult = useSetRecoilState(showResultState)
    const arenaFinishedCallback = (async () => {
        const { data: result } = await axios.get<Result>(`/api/get-result?token=${token}`)
        if (result) {
            setResult(result)
            setShowResult(true)
        }
        router.push("/arena/" + token);
    })
    const showResult = useRecoilValue(showResultState)
    useEffect(() => {
        ws.sendMessage({
            method: "SUBSCRIBE",
            param: {
                key: token
            }
        })
        ws.attachCallback("FINISH_ARENA", arenaFinishedCallback);
        return () => {
            ws.sendMessage({
                method: "UNSUBSCRIBE",
                param: {
                    key: token
                }
            })
            ws.detachCallback("FINISH_ARENA", arenaFinishedCallback);
        }
    }, []);
    return (
        <>
        { children }
         { showResult && <ReportComponent /> }
    </>
    );
}
