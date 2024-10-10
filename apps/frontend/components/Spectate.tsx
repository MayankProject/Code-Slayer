"use client";

import { useEffect, useRef, useState } from "react";
import CodeMirror, { ChangeSpec, EditorView } from "@uiw/react-codemirror";
import MonacoEditor from "@monaco-editor/react";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import Container from "./Container";
import { WebSocketManager } from "@/WebsocketManager";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { allSpectatorsCode, loader, tokenState } from "@/state";
import SpectatorCode from "./SpectatorCode";
import Tabs from "./Tabs";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BottomNavigation from "./BottomNavigation";
const ws = WebSocketManager.getInstance();
export default function Spectate({ usersDetails }: { usersDetails: any[] }) {
	const setLoader = useSetRecoilState(loader);
	const instanceId = useRef(Math.random()).current;
	const [onHovered, setOnHovered] = useState<number>(0);
	const token = useRecoilValue(tokenState);
	const router = useRouter();
	useEffect(() => {
		setLoader({ percentage: undefined });
	}, []);
	return (
		<>
			<div className="container relative mx-auto p-3 h-1 w-full min-h-[60vh]">
				<Tabs
					TabHead={
						usersDetails.map((user) => (
							{
								title: user.name,
								key: user.id
							}
						))
					}
					TabContent={
						usersDetails.map((user) => (
							{
								key: user.id,
								content: (
									<SpectatorCode id={user.id} key={user.id} />
								)
							}
						))
					}
				/>
			</div>
		</>
	);
}
