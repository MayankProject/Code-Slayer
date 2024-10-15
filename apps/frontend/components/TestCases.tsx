import Tabs from "@/components/Tabs";
import ExampleBody from "@/components/ExampleBody";
import { allProblems, currentProblem } from "@/state";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { Problem } from "./Smackdown";

export default function TestCases() {
    const Problems = useRecoilValue(allProblems);
    const problemIndex = useRecoilValue(currentProblem);
    const [problem, setProblem] = useState<Problem>(Problems[problemIndex]);

    useEffect(() => {
        setProblem(Problems[problemIndex]);
    }, [Problems, problemIndex]);

    return (
        <div className="overflow-auto" >
            <div className="p-3" >
                {problem && <Tabs
                    TabHead={
                        problem.TestCases.map((testCase, index) => (
                            {
                                title: "Testcase" + String(index + 1),
                                key: String(index + 1)
                            }
                        ))
                    }
                    TabContent={
                        problem.TestCases.map((testCase, index) => (
                            {
                                key: String(index + 1),
                                content: (
                                    <div className="font-bold" >
                                        <div>
                                            <h3>Input </h3>
                                            <ExampleBody>
                                                <div className="group font-menlo relative whitespace-pre-wrap break-all leading-[30px]" >
                                                    {testCase.input.replaceAll("\\n", "\n")}
                                                </div>
                                            </ExampleBody>
                                        </div>
                                        < div >
                                            <h3>Output </h3>
                                            <ExampleBody>
                                                <div className="group font-menlo relative whitespace-pre-wrap break-all leading-[30px]" >
                                                    {testCase.output.replaceAll("\\n", "\n")}
                                                </div>
                                            </ExampleBody>
                                        </div>
                                    </div>
                                )
                            }
                        ))
                    }
                />}
            </div>
        </div>
    )
}	
