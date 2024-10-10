import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import RedisManager from "./RedisManager";
import Worker from "./Worker";
import { payload } from "@repo/types"


const worker: Worker = Worker.getInstance()
async function main() {
	console.log("here", process.env.REDIS_URL)
	const redis: RedisManager = RedisManager.getInstance()
	while (1) {
		const res = await redis.getFromQueue()
		const { key, element }: { key: "submission", element: payload & { id: string } } | { key: "time_control", element: { token: string } } = { key: res.key, element: JSON.parse(res.element) }
		try {
			if (key === "submission") {
				const Payload = element
				const response = await worker.Submit({ arena_token: Payload.arena_token, problem_id: Payload.problem_id, source_code: Payload.source_code, language_id: Payload.language_id })
				console.log(response)
				redis.publish(Payload.id, { id: Payload.id, e: "SUBMISSION", ...response })
			}
			else {
				const Payload = element
				worker.timeControl(Payload.token)
			}
		}
		catch (e: unknown) {
			console.log(e)
		}
	}
}

main()

