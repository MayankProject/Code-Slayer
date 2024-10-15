import assert from "assert";
import axios, { AxiosResponse } from "axios";
import RedisManager from "./RedisManager";
import dotenv from "dotenv";
dotenv.config();

type payload = {
    arena_token: string;
    problem_id: string;
    source_code: string;
    language_id: number;
};
const redis = RedisManager.getInstance();
const { JUDGE0_URL, JUDGE0_API_KEY, BACKEND_URL, WORKER_SECRET_KEY } = process.env;

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
        try {
            const { data: problem }: AxiosResponse<{ TestCases: any, testBoilerCode: any }> = await axios.post<{ TestCases: any, testBoilerCode: any }>(`${BACKEND_URL}/api/get-testcases`, {
                id: parseInt(payload.problem_id),
                workerSecretKey: WORKER_SECRET_KEY,
            })
            const finalSourceCode = this.injectTestCase(payload.source_code, problem.TestCases, problem.testBoilerCode)
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
            if (data.stderr) {
                return { ...data };
            }
            const PassedAndFailedTestCases = data.stdout.trim().split("\n").slice(-2).map((x: string) => JSON.parse(x))
            const PassedTestCases = PassedAndFailedTestCases[0]
            const FailedTestCases = PassedAndFailedTestCases[1]
            if (FailedTestCases.length === 0) {
                try {
                    const submission_res: AxiosResponse<{ id: string }> = await axios.post<{ id: string }>(`${BACKEND_URL}/api/accept-submission`, {
                        token: payload.arena_token,
                        code: payload.source_code,
                        language: "javascript",
                        time: parseFloat(data.time),
                        memory: data.memory,
                        status: "Accepted",
                        problemId: parseInt(payload.problem_id),
                        workerSecretKey: WORKER_SECRET_KEY,
                    })
                    if (submission_res.status === 200) {
                        data.submission_id = submission_res.data.id;
                    }
                    else {
                        throw new Error("Could not submit to backend");
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            return { ...data, PassedTestCases, FailedTestCases };
        }
        catch (err) {
            console.log(err);
        }

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
                const wrong = (message) => {
                console.log("status: failed")
                    console.log(message);
                    failedTestCases.push(${i + 1});
                    console.log("\\n\\n--Testcase ${i + 1} Output End")
                }
                console.log("--Testcase ${i + 1} Output \\n\\n")
                ${_testBoilerCode}
                console.log("status: passed")
                console.log(\`Expected : \${output} \\nYour output : \${result}\`);
                passedTestCases.push(${i + 1});
                console.log("\\n\\n--Testcase ${i + 1} Output End")
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
        const { data: arena }: AxiosResponse<{ timeLimit: any }> = await axios.post<{ timeLimit: any }>(`${BACKEND_URL}/api/get-timelimit`, {
            token,
            workerSecretKey: WORKER_SECRET_KEY,
        })
        assert(arena, "Arena not found");
        this.ArenaTimeMap.set(token, arena.timeLimit);
        this.reduceTime({ token, interval: 10 });
    }
    async reduceTime({ token, interval }: { token: string, interval: number }) {
        try {
            const timeLimit = this.ArenaTimeMap.get(token);
            assert(timeLimit, "TimeLimit not found");
            this.ArenaTimeMap.set(token, timeLimit - interval);
            if (timeLimit - interval <= 0) {
                console.log("finishing arena")
                await axios.post(`${BACKEND_URL}/api/finish-arena`, {
                    token,
                    workerSecretKey: WORKER_SECRET_KEY
                })
                return;
            }
            axios.post(`${BACKEND_URL}/api/update-timelimit`, {
                token,
                workerSecretKey: WORKER_SECRET_KEY,
                timeLimit: timeLimit - interval - 1
            })
            redis.publish(token, { e: "TIME_CONTROL", time: timeLimit - interval })
            setTimeout(() => this.reduceTime({ token, interval }), interval * 1000);
        }
        catch (err) {
            console.log(err);
        }
    }
}
