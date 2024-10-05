import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useEffect, useState } from "react";
import Pane from "./Pane";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { WebSocketManager } from "@/WebsocketManager";
const ws = WebSocketManager.getInstance();
import submit from "@/actions/submit";
import { allProblems, consoleVisible, currentProblem, testResult } from "@/state";
import { useSession } from "next-auth/react";
import verifySubmission from "@/actions/verifySubmission";

export default function Playground({ token }: { token: string }) {
	const session = useSession();
	const currentProblemIndex = useRecoilValue(currentProblem);
	const [Problems, setProblems] = useRecoilState(allProblems);
	const Problem = Problems[currentProblemIndex];
	const id = Problem?.id;
	const boilerplate = Problem?.boilerplate;
	const setConsole = useSetRecoilState(consoleVisible);
	async function submit_fn() {
		const test_id = await submit({ arena_token: token, problem_id: String(id), source_code: code, language_id: language });
		ws.sendMessage({
			method: "SUBSCRIBE",
			param: {
				key: test_id
			}
		})
		ws.attachSolutionCallback(test_id, (message) => {
			if (message.submission_id) {
				verifySubmission(message.submission_id);
			}
			setProblems((prev) => {
				return prev.map((problem) => {
					if (problem.id === id) {
						problem.testResult = message;
					}
					return problem;
				})
			});
			setConsole(true);
		});
	}
	function handleChangeMirror(value: string, viewUpdate: any) {
		ws.sendMessage({
			method: "PUBLISH",
			param: {
				key: token,
				data: {
					user_id: session?.data?.user?.id.toString() || "",
					e: "UPDATE_CODE",
					data: {
						code: value,
					}
				}
			}
		})
		setProblems((prev) => {
			return prev.map((problem) => {
				if (problem.id === id) {
					problem.boilerplate = value;
				}
				return problem;
			})
		});
		setCode(value);
	}
	const [language, setLanguage] = useState(63);
	const [code, setCode] = useState(boilerplate);

	useEffect(() => {
		setCode(boilerplate);
	}, [boilerplate]);
	return (
		<Pane className= "!overflow-hidden" >
		<div className='w-full  code-editor h-full overflow-auto' >
			<CodeMirror
					value={ code }
	onChange = {(value, viewUpdate) => {
		handleChangeMirror(value, viewUpdate);
	}
}
className = "bg-red-200 text-sm"
theme = { vscodeDark }
extensions = { [javascript()]}
	/>
	</div>
	< div className = "sticky bottom-0 w-full bg-[#1e1e1e] flex gap-2 px-4 rounded-md" >
		<button
					className={ `relative bg-[#FFFFFF1A] transition-200 my-2 px-4 py-[4px] rounded-lg  text-gray-400` }>
	Run
	</button>
	< button
onClick = { submit_fn }
className = {`relative bg-[#2CBB5D] transition-200 my-2 px-4 py-[4px] rounded-lg  text-white`}>
	Submit
	</button>
	</div>
	</Pane>
	);
}
