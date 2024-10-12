import assert from "assert";
import axios from "axios";
import { payload } from "@repo/types";
import { PrismaClient } from "@prisma/client";
import RedisManager from "./RedisManager";
import dotenv from "dotenv";
dotenv.config();
const redis = RedisManager.getInstance();
const db = new PrismaClient();
const { JUDGE0_URL, JUDGE0_API_KEY } = process.env;

export default class Worker {
	private static instance: Worker;
	private ArenaTimeMap: Map<string, number> = new Map();
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
		const { data: { token } }: {
			data: {
				token: string;
			}
		} = await axios.post(`${JUDGE0_URL}/submissions`, { ...payload, source_code: finalSourceCode }, {
			headers: {
				"x-rapidapi-key": JUDGE0_API_KEY,
			}
		})
		const data = await this.getResult(token);
		console.log(data.stdout);
		console.log(data.stdout.trim().split("\\n").slice(-2));
		const PassedAndFailedTestCases = data.stdout.trim().split("\n").slice(-2).map((x: string) => JSON.parse(x))
		console.log(PassedAndFailedTestCases);
		const PassedTestCases = PassedAndFailedTestCases[0]
		const FailedTestCases = PassedAndFailedTestCases[1]
		if (FailedTestCases.length === 0) {
			const arenaId = await db.arena.findFirst({
				where: {
					token: payload.arena_token,
				},
				select: {
					id: true,
				}
			})
			assert(arenaId, "Arena not found");
			const submissionId = await db.submission.create({
				data: {
					code: payload.source_code,
					language: "javascript",
					time: parseFloat(data.time),
					memory: data.memory,
					status: "Accepted",
					problemId: parseInt(payload.problem_id),
					arenaId: arenaId.id,
				}
			})
			data.submission_id = submissionId.id;
		}
		return { ...data, PassedTestCases, FailedTestCases };

	}

	injectTestCase(source_code: string, TestCases: { input: string, output: string }[], testBoilerCode: string): string {
		let extraCode = new String(`
			const passedTestCases = [];
			const failedTestCases = [];

								   `);
		for (let i = 0; i < TestCases.length; i++) {
			const testcase = TestCases[i];
			let _testBoilerCode = testBoilerCode;
			for (let i = 0; i < testcase.input.split("\\n").length; i++) {
				const input = testcase.input.split("\\n")[i];
				_testBoilerCode = _testBoilerCode.replace(`#INPUT_${i + 1}#`, input)
			}
			_testBoilerCode = _testBoilerCode.replace("#OUTPUT#", testcase.output).replace("#i#", String(i + 1));
			_testBoilerCode = `
			try {
				console.log("--Testcase ${i + 1} Output \\n\\n")
				${_testBoilerCode}
				passedTestCases.push(${i + 1});
				console.log("\\n\\n--Testcase ${i + 1} Output End")
			} catch (error) {
				failedTestCases.push(${i + 1});
				console.log("\\n\\n--Testcase ${i + 1} Output End")
			}
			`;

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
		extraCode += `
			console.log(passedTestCases);
			console.log(failedTestCases);
		`
		return source_code + extraCode;
	}

	async getResult(token: string, interval?: number): Promise<any> {
		const { data } = await axios.get(`${JUDGE0_URL}/submissions/${token}`, {
			headers: {
				"x-rapidapi-key": JUDGE0_API_KEY,
			}
		})
		if (data.status.description === "In Queue" || data.status.description === "Processing") {
			await new Promise(resolve => setTimeout(resolve, interval || 1000));
			return await this.getResult(token, interval ? interval * 2 : 2000);
		}
		else {
			return data;
		}
	}
	async timeControl(token: string) {
		const arena = await db.arena.findFirst({
			where: {
				token: token,
			},
			select: {
				timeLimit: true,
			}
		})

		assert(arena, "Arena not found");
		this.ArenaTimeMap.set(token, arena.timeLimit);
		this.reduceTime({ token, interval: 10 });
	}
	async reduceTime({ token, interval }: { token: string, interval: number }) {
		const timeLimit = this.ArenaTimeMap.get(token);
		assert(timeLimit, "TimeLimit not found");
		this.ArenaTimeMap.set(token, timeLimit - interval);
		if (timeLimit - interval <= 0) {
			redis.publish(token, { id: token, e: "FINISH_ARENA" })
			return;
		}
		await db.arena.update({
			where: {
				token: token,
			},
			data: {
				timeLimit: timeLimit - interval - 1
			}
		})
		redis.publish(token, { e: "TIME_CONTROL", time: timeLimit - interval })
		setTimeout(() => this.reduceTime({ token, interval }), interval * 1000);
	}
}
