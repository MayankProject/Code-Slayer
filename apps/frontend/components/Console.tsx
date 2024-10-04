import { allProblems, currentProblem, testResult } from "@/state";
import Error from "./Error";
import ExampleBody from "./ExampleBody";
import TestcasePassed from "./TestcasePassed";
import Tabs from "./Tabs";
import { useRecoilValue } from "recoil";
export default function Console() {
	const testCases = [
		{
			id: 'Case 1',
			stdout: "[0, 1]"
		},
		{
			id: 'Case 2',
			stdout: "[1, 3]"
		},
		{
			id: 'Case 3',
			stdout: "[1, 2]"
		}
	];
	const currentProblemIndex = useRecoilValue(currentProblem);
	const Problems = useRecoilValue(allProblems);
	const Problem = Problems[currentProblemIndex];
	const testResultValue = Problem?.testResult;
	return (
		<div className= "h-full overflow-scroll px-4 py-2" >
		{
			Object.keys(testResultValue).length ?
				<div>
				{
					testResultValue.status.id === 3 ?
						<TestcasePassed /> :
							(
								<>
								<ExampleBody>
								<div className="group font-menlo relative whitespace-pre-wrap break-all text-xs text-red-60 dark:text-red-60" >
								{ testResultValue.stdout }
								</div>
								</ExampleBody>
							< Error text = { testResultValue.stderr } />

							</>
							)
						}
				</div> :
				< div className="h-full flex justify-center items-center opacity-70 " > Empty Console</ div >
			}
</div>
	)
}

