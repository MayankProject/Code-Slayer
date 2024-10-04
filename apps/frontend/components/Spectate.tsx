"use client";

import { useEffect, useRef, useState } from "react";
import CodeMirror, { ChangeSpec, EditorView } from "@uiw/react-codemirror";
import MonacoEditor from "@monaco-editor/react";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import Container from "./Container";
import { WebSocketManager } from "@/WebsocketManager";
import { useRecoilState } from "recoil";
import { allSpectatorsCode } from "@/state";
import SpectatorCode from "./SpectatorCode";
import Tabs from "./Tabs";

const ws = WebSocketManager.getInstance();

export default function Spectate({ usersDetails }: { usersDetails: any[] }) {
	console.log(usersDetails);
	const [spectatorsCode, setSpectatorsCode] = useRecoilState(allSpectatorsCode);
	return (
		<Container>
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
		</Container>
	);
}
