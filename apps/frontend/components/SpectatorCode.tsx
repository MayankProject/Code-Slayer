import CodeMirror, { EditorState } from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { WebSocketManager } from "@/WebsocketManager";
import { useEffect, useRef, useState } from "react";
const ws = WebSocketManager.getInstance();
export default function SpectatorCode({ id }: { id: string }) {
	const editorRef = useRef<any>(null);
	const [code, setCode] = useState("")
	function updateCode(data: { code: string }) {
		setCode(data.code);
		console.log(data);
	}
	useEffect(() => {
		ws.attachCallback("UPDATE_CODE", (message: { user_id: string, data: { code: string } }) => {
			if (message.user_id != id) return;
			updateCode(message.data);
		});
	}, []);
	return (
		<CodeMirror
			value={code}
			onCreateEditor={
				(editor) => {
					editorRef.current = editor;
				}
			}
			className="bg-red-200 text-sm"
			theme={vscodeDark}
			extensions={[javascript()]}
		/>
	);
}	
