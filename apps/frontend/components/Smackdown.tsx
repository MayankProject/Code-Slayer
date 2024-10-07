"use client";
import "allotment/dist/style.css";
import ProblemDescription from "@/components/ProblemDescription";
import { Allotment } from "allotment";
import Playground from "@/components/Playground";
import TestCases from "./TestCases";
import { useEffect, useState } from "react";
import Pane from "./Pane";
import Console from "./Console";
import { useRecoilState, useSetRecoilState } from "recoil";
import { allProblems, canSpectateState, consoleVisible, currentProblem, timeState } from "@/state";
import { useRouter } from "next/navigation";
import finishArena from "@/actions/finish-arena";
import { WebSocketManager } from "@/WebsocketManager";
import submit from "@/actions/submit";
import verifySubmission from "@/actions/verifySubmission";
import { toast } from "react-toastify"
import resign from "@/actions/resign";

export interface Problem {
	id: number;
	title: string;
	description: string;
	difficulty: string;
	boilerplate: string;
}

const ws = WebSocketManager.getInstance();
export default function Smackdown({ token, problemsData, timeLimit }: { token: string, problemsData: Problem[], timeLimit: number }) {
	const [Problems, setProblems] = useRecoilState(allProblems);
	const [time, setTime] = useRecoilState(timeState);
	const [problemIndex, setProblemIndex] = useRecoilState(currentProblem);
	const [Problem, setProblem] = useState<Problem>(Problems[problemIndex]);
	const [_Console, setConsole] = useRecoilState(consoleVisible);
	const [nProblems, setNProblems] = useState(problemsData.length);
	const [canSpectate, setCanSpectate] = useRecoilState(canSpectateState);
	const router = useRouter();
	const showConsole = () => {
		setConsole(true);
	};
	const hideConsole = () => {
		setConsole(false);
	};
	const nextProblem = () => {
		if (problemIndex === nProblems - 1) {
			setProblemIndex(0);
			return;
		}
		setProblemIndex(problemIndex + 1);
	};
	const prevProblem = () => {
		if (problemIndex === 0) {
			setProblemIndex(nProblems - 1);
			return;
		}
		setProblemIndex(problemIndex - 1);
	};
	const timeUpdateCallback = (time: { time: number }) => {
		setTime(time.time);
	};
	const arenaFinishedCallback = (() => {
		finishArena(token);
		router.push("/arena/" + token);
	})
	useEffect(() => {

		ws.attachCallback("TIME_CONTROL", timeUpdateCallback);
		ws.attachCallback("FINISH_ARENA", arenaFinishedCallback);

		setTime(timeLimit);
		setProblemIndex(0);
		setProblems(() => {
			return problemsData.map((problem) => {
				return { ...problem, testResult: {} };
			});
		});

		return () => {
			ws.detachCallback("TIME_CONTROL", timeUpdateCallback);
			ws.detachCallback("FINISH_ARENA", arenaFinishedCallback);
		}
	}, []);
	const _resign = () => toast.promise(new Promise(async (resolve, reject) => {
		const res = await resign(token);
		if (res) {
			resolve(true);
		}
		reject(false);
	}), {
		pending: "Resigning...",
		success: "You have resigned! LMFAO, LOOSER!",
		error: "standing found or you have already resigned"
	});
	function formatTime(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		// Add leading zeros to minutes and seconds if needed
		const formattedMinutes = String(minutes).padStart(2, '0');
		const formattedSeconds = String(remainingSeconds).padStart(2, '0');

		return `${formattedMinutes}:${formattedSeconds}`;
	}
	const submit_fn = () => toast.promise(new Promise(async (resolve, reject) => {
		const id = Problem?.id;
		const code = Problem?.boilerplate;
		const language = 63;
		const test_id = await submit({ arena_token: token, problem_id: String(id), source_code: code, language_id: language });

		ws.sendMessage({
			method: "SUBSCRIBE",
			param: {
				key: test_id
			}
		})
		ws.attachSolutionCallback(test_id, async (message) => {
			if (message.submission_id) {
				const res = await verifySubmission(message.submission_id, token);
				if (res) {
					toast.success(() => {
						return <div className="flex gap-2 items-center" >
							<h1 onClick={
								() => {
									router.push(`/arena/${token}/spectate`);
								}
							}> Spectate! </h1>
						</div>;
					});
					setCanSpectate(true);
				}
			}
			if (message.status.id === 3) {
				resolve(true);
			}
			else {
				reject(false);
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
	}), {
		pending: "Submitting...",
		success: "All Tests Passed!",
		error: "Oopsie Daisy!"
	});
	useEffect(() => {
		setProblem(Problems[problemIndex]);
	}, [problemIndex, Problems]);
	return (
		<div className="p-2 h-screen w-full flex-1 overflow-scroll resize" >
			<Allotment>
				<Allotment.Pane className="px-[4px]" >
					<div className="flex justify-between px-1 items-center" >
						<div className="flex gap-2" >
							<div className={`relative flex items-center gap-3 border hover:bg-[#1e1e1e] border-[#1e1e1e] transition-200 my-2 px-4 py-[4px] rounded-lg  text-gray-400`}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
								</svg>

								< h1 className="text-2xl font-bold text-white" > {formatTime(time)} </h1>
							</div>
							< div className={`relative border cursor-pointer flex items-center hover:bg-[#1e1e1e] border-[#1e1e1e] transition-200 my-2 px-4 py-[4px] rounded-lg  text-gray-400`
							}
								onClick={() => {
									router.push(`/arena/${token}`);
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
									<path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
								</svg>
							</div>
							< div className={`relative border cursor-pointer flex items-center hover:bg-[#1e1e1e] border-[#1e1e1e] transition-200 my-2 px-4 py-[4px] rounded-lg  text-gray-400`
							}
								onClick={_resign}
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
									<path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
								</svg>
							</div>
							{
								canSpectate &&
								<div className={
									`relative flex items-center border cursor-pointer hover:bg-[#1e1e1e] border-[#1e1e1e] transition-200 my-2 px-4 py-[4px] rounded-lg  text-gray-400`
								}
									onClick={() => {
										router.push(`/arena/${token}/spectate`);
									}
									}
								>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
										<path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
										<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
									</svg>
								</div>
							}
						</div>
						< div className="flex gap-2 items-center" >
							<button
								onClick={prevProblem}
								className={`relative border hover:bg-[#1e1e1e] border-[#1e1e1e] transition-200  px-4 py-[7px] rounded-lg  text-gray-400`
								}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
									<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
								</svg>
							</button>
							< button
								onClick={nextProblem}
								className={`relative hover:bg-[#1e1e1e] border border-[#1e1e1e] transition-200  px-4 py-[7px] rounded-lg  text-white`}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
									<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
								</svg>
							</button>
							|
							<button
								onClick={submit_fn}
								className={`relative bg-[#2CBB5D] transition-200 my-2 px-4 py-[7px] rounded-lg  text-white`}>
								Submit
							</button>

						</div>
					</div>
					< ProblemDescription description={Problem?.description} />
				</Allotment.Pane>
				< Allotment vertical className="overflow-hidden relative" >
					<Allotment.Pane className="px-[4px] pb-3" >
						<Playground token={token} />
					</Allotment.Pane>
					< Allotment.Pane className="px-[4px]" >
						<Pane className="mt-2" >
							<div className="m-[4px]" >
								<div className="sticky bottom-0 w-full bg-[#1e1e1e] flex gap-2 px-1 rounded-md" >
									<button
										onClick={hideConsole}
										className={`relative transition-200 hover:bg-[#434343] my-1 py-1 px-2 text-sm rounded-lg ${!_Console ? 'text-white' : 'text-gray-400'}`
										}>
										Testcases
									</button>
									< button
										onClick={showConsole}
										className={`relative transition-200 hover:bg-[#434343] text-sm my-1 py-1 px-2 rounded-lg  ${_Console ? 'text-white' : 'text-gray-400'}`}>
										Console
									</button>
								</div>
							</div>
							< div className="h-full  m-[4px]" >
								{_Console ? <Console /> : <TestCases />}
							</div>
						</Pane>
					</Allotment.Pane>
				</Allotment>
			</Allotment>
		</div >
	);
}
