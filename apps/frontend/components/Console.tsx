import { testResult } from "@/state";
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
	const testResultValue = useRecoilValue(testResult);
	console.log(Boolean(Object.keys(testResultValue).length));
	return (
		<div className="overflow-scroll px-4 py-2" >
			{Object.keys(testResultValue).length ? (testResultValue.status.id === 3 ? <TestcasePassed /> : <Error text={testResultValue.stderr} />) : <div className="text-center text-sm">Empty Console</div>}
		</div>
	)
}

