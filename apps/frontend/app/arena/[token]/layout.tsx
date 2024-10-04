"use client";
import { WebSocketManager } from "@/WebsocketManager";
import { useEffect } from "react";
const ws = WebSocketManager.getInstance();
export default function Layout({ children, params: { token } }: { children: React.ReactNode, params: { token: string } }) {
	useEffect(() => {
		ws.sendMessage({
			method: "SUBSCRIBE",
			param: {
				key: token
			}
		})
	}, []);
	return (
		<>
			{children}
		</>
	);
}
