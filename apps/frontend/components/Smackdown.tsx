"use client";
import "allotment/dist/style.css";
import ProblemDescription from "@/components/ProblemDescription";
import { Allotment } from "allotment";
import Playground from "@/components/Playground";
import TestCases from "./TestCases";
import { useState } from "react";
import Pane from "./Pane";
import Console from "./Console";
export default function Smackdown({ problem }: {
	problem: {
		id: number;
		title: string;
		description: string;
		difficulty: string;
		boilerplate: string;
	}
}) {
	const [_Console, setConsole] = useState(false);
	const showConsole = () => {
		setConsole(true);
	};
	const hideConsole = () => {
		setConsole(false);
	};
	return (
		<div className="p-2 h-screen w-full flex-1 overflow-scroll resize" >
			<Allotment>
				<Allotment.Pane className="px-[4px]" >
					<ProblemDescription description={problem.description} />
				</Allotment.Pane>
				< Allotment vertical className="overflow-hidden relative" >
					<Allotment.Pane className="px-[4px] pb-3" >
						<Playground boilerplate={problem.boilerplate} id={problem.id} />
					</Allotment.Pane>
					< Allotment.Pane className="px-[4px]" >
						<Pane className="mt-2">
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
