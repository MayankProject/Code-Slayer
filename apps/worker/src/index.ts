import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import RedisManager from "./RedisManager";
import Worker from "./Worker";

type payload = {
    arena_token: string;
    problem_id: string;
    source_code: string;
    language_id: number;
};
type message = {
    key: "submission",
    element: payload & { id: string }
} |
{
    key: "start_arena",
    element: { token: string }
} |
{
    key: "finish_arena",
    element: { token: string }
}

const worker: Worker = Worker.getInstance()
async function main() {
    const redis: RedisManager = RedisManager.getInstance()
    while (1) {
        console.log("waiting for new message")
        const res = await redis.getFromQueue()
        const { key, element }: message = { key: res.key, element: JSON.parse(res.element) }
        console.log(key, element)
        try {
            if (key === "submission") {
                const Payload = element
                const response = await worker.Submit({ arena_token: Payload.arena_token, problem_id: Payload.problem_id, source_code: Payload.source_code, language_id: Payload.language_id })
                console.log(response)
                redis.publish(Payload.id, { id: Payload.id, e: "SUBMISSION", ...response })
            }
            else if (key === "start_arena") {
                const Payload = element
                worker.timeControl(Payload.token)
            }
            else if (key === "finish_arena") {
                const Payload = element
                worker.finishArena(Payload.token)
            }
        }
        catch (e: unknown) {
            console.log(e)
        }
    }
}

main()

