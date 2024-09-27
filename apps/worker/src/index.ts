import RedisManager from "./RedisManager";
import Worker from "./Worker";
import { payload } from "@repo/types"
const worker: Worker = Worker.getInstance()
async function main() {
	const redis: RedisManager = RedisManager.getInstance()
	while (1) {
		const Payload = await redis.getFromQueue() as payload & { id: string }
		try {
			const response = await worker.Submit({ problem_id: Payload.problem_id, source_code: Payload.source_code, language_id: Payload.language_id })
			redis.publishSubmission(Payload.id, { id: Payload.id, e: "SUBMISSION", ...response })
		}
		catch (e: unknown) {
			console.log(e)
		}
	}
}

main()

