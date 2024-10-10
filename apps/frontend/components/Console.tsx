import { allProblems, currentProblem } from "@/state";
import ExampleBody from "./ExampleBody";
import TestcasePassed from "./TestcasePassed";
import { useRecoilValue } from "recoil";
export default function Console() {
	const currentProblemIndex = useRecoilValue(currentProblem);
	const Problems = useRecoilValue(allProblems);
	const Problem = Problems[currentProblemIndex];
	const testResultValue = Problem?.testResult;
	const PassedTestCases = Problem?.PassedTestCases;
	const FailedTestCases = Problem?.FailedTestCases;
	const allTestCasesDetails: { [key: string]: { passed: boolean } } = {};
	PassedTestCases.forEach((testCase) => {
		allTestCasesDetails[testCase.toString()] = {
			passed: true
		};
	});
	FailedTestCases.forEach((testCase) => {
		allTestCasesDetails[testCase.toString()] = {
			passed: false
		};
	});
	return (
		<div className="h-full overflow-scroll px-4 py-2" >
			{
				Object.keys(testResultValue).length ?
					<div>
						{
							testResultValue.status.id === 3 ?
								<TestcasePassed /> :
								(
									<>
										<div className="flex gap-3 items-center ">
											{
												Object.entries(allTestCasesDetails).map(([key, value]) => (
													<button
														key={key}
														className={`relative  transition-200 mb-4 px-4 py-[4px] rounded-xl ${value.passed ? "bg-[#2CBB5D]" : "bg-destructive"}`}
													>
														Testcase {key}
													</button>
												))
											}

										</div>
										<ExampleBody>
											<div className="group font-menlo relative whitespace-pre-wrap break-all text-xs text-red-60 dark:text-red-60" >
												{testResultValue.stdout}
											</div>
										</ExampleBody>

									</>
								)
						}
					</div> :
					< div className="h-full flex justify-center items-center opacity-70 " > Empty Console</ div >
			}
		</div>
	)
}

