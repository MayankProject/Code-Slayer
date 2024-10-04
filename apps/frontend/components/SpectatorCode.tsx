import { WebSocketManager } from "@/WebsocketManager";
import MonacoEditor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const ws = WebSocketManager.getInstance();
export default function SpectatorCode({ id }: { id: string }) {
	const editorRef = useRef<any>(null);
	const [code, setCode] = useState(`function twoSum(nums, target) {
    
};
`)
	function updateCode(data: any[]) {
		if (editorRef.current) {
			const editor = editorRef.current;
			const model = editor.getModel();
			data.forEach((diff) => {

				const { rangeOffset, rangeLength, text } = diff;
				const startPosition = model.getPositionAt(rangeOffset);
				const endPosition = model.getPositionAt(rangeOffset + rangeLength);

				model.applyEdits([
					{
						range: {
							startLineNumber: startPosition.lineNumber,
							startColumn: startPosition.column,
							endLineNumber: endPosition.lineNumber,
							endColumn: endPosition.column,
						},
						text: text,
					},
				]);
			});
		}
		console.log(data);
	}

	useEffect(() => {
		ws.attachCallback("UPDATE_CODE", (message: { user_id: string, data: { data: any[] } }) => {
			console.log(message, id);
			if (message.user_id != id) return;
			updateCode(message.data.data);
		});
	}, []);
	return (
		<MonacoEditor
			height="500px"
			language="javascript"
			value={code}
			onMount={(editor) => {
				editorRef.current = editor;
			}
			}
			options={{
				readOnly: true, // Make the spectator editor read-only
			}}
			theme="vs-dark"
		/>
	);
}	
