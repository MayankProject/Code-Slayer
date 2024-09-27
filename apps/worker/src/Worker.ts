import assert from "assert";
import axios from "axios";
import { JUDGE0_URL } from "./config";
import { payload } from "@repo/types";
//@ts-ignore
import db from "../../../packages/db/src";
export default class Worker {
	private static instance: Worker;
	static getInstance() {
		if (!Worker.instance) {
			Worker.instance = new Worker();
		}
		return Worker.instance;
	}

	async Submit(payload: payload) {
		const problem = await db.problem.findFirst({
			where: {
				id: parseInt(payload.problem_id),
			},
			select: {
				TestCases: true,
				testBiolerCode: true,
			}
		})
		assert(problem, "Problem not found");
		assert(problem?.TestCases, "TestCases not found");

		const finalSourceCode = this.injectTestCase(payload.source_code, problem.TestCases, problem.testBiolerCode)
		console.log(finalSourceCode);
		const { data: { token } }: {
			data: {
				token: string;
			}
		} = await axios.post(`${JUDGE0_URL}/submissions`, { ...payload, source_code: finalSourceCode })
		return await this.getResult(token);
	}

	injectTestCase(source_code: string, TestCases: { input: string, output: string }[], testBoilerCode: string): string {
		let extraCode = new String("");
		for (let i = 0; i < TestCases.length; i++) {
			const testcase = TestCases[i];
			let _testBoilerCode = testBoilerCode;
			for (let i = 0; i < testcase.input.split("\\n").length; i++) {
				const input = testcase.input.split("\\n")[i];
				console.log(input);
				_testBoilerCode = _testBoilerCode.replace(`#INPUT_${i + 1}#`, input)
			}
			_testBoilerCode = _testBoilerCode.replace("#OUTPUT#", testcase.output).replace("#i#", String(i + 1));
			;

			const wrapInsideFunction = (code: string) => {
				const funcName = `test${Math.random().toString(36).slice(2)}`;
				return `
					function ${funcName}() {
						${code}
					}
					${funcName}();
				`
			}
			extraCode += wrapInsideFunction(_testBoilerCode);
		}
		return source_code + extraCode;

	}

	async getResult(token: string, interval?: number): Promise<any> {
		const { data } = await axios.get(`${JUDGE0_URL}/submissions/${token}`)
		if (data.status.description === "In Queue" || data.status.description === "Processing") {
			await new Promise(resolve => setTimeout(resolve, interval || 1000));
			return await this.getResult(token, interval ? interval * 2 : 2000);
		}
		else {
			return data;
		}
	}
}
