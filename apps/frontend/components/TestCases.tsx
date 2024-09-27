import Pane from "@/components/Pane";
import Tabs from "@/components/Tabs";
import ExampleBody from "@/components/ExampleBody";

export default function TestCases() {
	const testCases = [
		{
			id: 'Case 1',
			input: "nums = [2,7,11,15], target = 9",
			output: "[0, 1]"
		},
		{
			id: 'Case 2',
			input: "nums = [1, 5, 3, 6], target = 9",
			output: "[1, 3]"
		},
		{
			id: 'Case 3',
			input: "nums = [3, 2, 4], target = 6",
			output: "[1, 2]"
		}
	];
	return (
		<div className="overflow-scroll" >
			<div className="p-3">
				<Tabs
					TabHead={
						testCases.map((testCase) => (
							{
								title: testCase.id,
								key: testCase.id
							}
						))
					}
					TabContent={
						testCases.map((testCase) => (
							{
								key: testCase.id,
								content: (
									<div className="font-bold">
										<div>
											<h3>Input</h3>
											<ExampleBody>
												{testCase.input}
											</ExampleBody>
										</div>
										<div>
											<h3>Output</h3>
											<ExampleBody>
												{testCase.output}
											</ExampleBody>
										</div>
									</div>
								)
							}
						))
					}
				/>
			</div>
		</div>
	)
}	
