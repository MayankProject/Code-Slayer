import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useState } from "react";
import Pane from "./Pane";
import { useSetRecoilState } from "recoil";
import { WebSocketManager } from "@/WebsocketManager";
const ws = WebSocketManager.getInstance();
import submit from "@/actions/submit";
import { testResult } from "@/state";
export default function Playground({ id, boilerplate }: { id: number, boilerplate: string }) {
	const setTestResult = useSetRecoilState(testResult);
	async function submit_fn() {
		const test_id = await submit({ problem_id: String(id), source_code: code, language_id: language });
		ws.sendMessage({
			method: "SUBSCRIBE",
			param: {
				type: "token",
				key: test_id
			}
		})

		ws.attachSolutionCallback(test_id, (message) => {
			setTestResult(message);
			console.log(message);
		});
	}
	const [language, setLanguage] = useState(63);
	const [code, setCode] = useState(boilerplate);
	return (
		<Pane>
			<div className='w-full bg-[#1e1e1e] h-full overflow-auto' >
				<CodeMirror
					value={code}
					onChange={(value, viewUpdate) => {
						setCode(value);
					}
					}
					className="bg-red-200 text-sm"
					theme={vscodeDark}
					extensions={[javascript()]}
				/>
			</div>
			< div className="sticky bottom-0 w-full bg-[#1e1e1e] flex gap-2 px-4 rounded-md" >
				<button
					className={`relative bg-[#FFFFFF1A] transition-200 my-2 px-4 py-[4px] rounded-lg  text-gray-400`}>
					Run
				</button>
				< button
					onClick={submit_fn}
					className={`relative bg-[#2CBB5D] transition-200 my-2 px-4 py-[4px] rounded-lg  text-white`}>
					Submit
				</button>
			</div>
		</Pane>
	);
}
