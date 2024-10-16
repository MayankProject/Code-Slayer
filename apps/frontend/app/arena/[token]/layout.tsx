"use client";
import ReportComponent from "@/components/ReportComponent";
import { showResultState } from "@/state";
import { WebSocketManager } from "@/WebsocketManager";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
const ws = WebSocketManager.getInstance();
export default function Layout({ children, params: { token } }: { children: React.ReactNode, params: { token: string } }) {
    const showResult = useRecoilValue(showResultState)
    useEffect(() => {
        ws.sendMessage({
            method: "SUBSCRIBE",
            param: {
                key: token
            }
        })
        return () => {
            ws.sendMessage({
                method: "UNSUBSCRIBE",
                param: {
                    key: token
                }
            })
        }
    }, []);
    return (
        <>
            {children}
            {showResult && <ReportComponent />}
        </>
    );
}
