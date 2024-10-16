"use client";
import { resultDataState, showResultState } from "@/state";
import { WebSocketManager } from "@/WebsocketManager";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios"
import { useSetRecoilState } from "recoil";
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
	useEffect(() => {
		ws.attachCallback("FINISH_ARENA", arenaFinishedCallback);
		return () => {
			ws.detachCallback("FINISH_ARENA", arenaFinishedCallback);
		}
	}, []);
	return (
		<>
		{ children }
		</>
	);
}
