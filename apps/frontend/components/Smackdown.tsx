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
import { allProblems, consoleVisible, currentProblem } from "@/state";

export interface Problem {
	id: number;
	title: string;
	description: string;
	difficulty: string;
	boilerplate: string;
}

export default function Smackdown({ token, problemsData }: { problemsData: Problem[], token: string }) {
	const [Problems, setProblems] = useRecoilState(allProblems);
	const [problemIndex, setProblemIndex] = useRecoilState(currentProblem);
	const [Problem, setProblem] = useState<Problem>(Problems[problemIndex]);
	const [_Console, setConsole] = useRecoilState(consoleVisible);
	const [nProblems, setNProblems] = useState(problemsData.length);
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
	useEffect(() => {
		setProblemIndex(0);
		setProblems(() => {
			return problemsData.map((problem) => {
				return { ...problem, testResult: {} };
			});
		});
	}, []);

	useEffect(() => {
		setProblem(Problems[problemIndex]);
	}, [problemIndex, Problems]);
	return (
		<div className="p-2 h-screen w-full flex-1 overflow-scroll resize" >
			<Allotment>
				<Allotment.Pane className="px-[4px]" >
					< div className="w-full flex gap-2 px-4 rounded-md" >
						<button
							onClick={prevProblem}
							className={`relative bg-[#FFFFFF1A] transition-200 my-2 px-4 py-[4px] rounded-lg  text-gray-400`}>
							Previous
						</button>
						< button
							onClick={nextProblem}
							className={`relative bg-[#2CBB5D] transition-200 my-2 px-4 py-[4px] rounded-lg  text-white`}>
							Next
						</button>
					</div>
					<ProblemDescription description={Problem?.description} />
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
		</div>
	);
}
