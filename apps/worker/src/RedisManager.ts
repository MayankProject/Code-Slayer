import { createClient, RedisClientType } from "redis"

export default class RedisManager {
	private client: RedisClientType;
	private publisher: RedisClientType;
	private static instance: RedisManager;
	private constructor() {
		this.client = createClient();
		this.publisher = createClient();
		this.client.connect()
		this.publisher.connect()
	}
	static getInstance() {
		if (!RedisManager.instance) {
			const instance = new RedisManager()
			RedisManager.instance = instance;
		}
		return RedisManager.instance;
	}
	async getFromQueue() {
		return new Promise((resolve) => {
			this.client.brPop("submission", 0).then((response) => {
				if (!response) {
					throw new Error("No Response!")
				}
				resolve(JSON.parse(response.element))
			})
		})
	}
	// Todo: Typecasing for sending to api back
	publishSubmission(id: string, response: any) {
		this.publisher.publish(id, JSON.stringify(response))
	}
}
