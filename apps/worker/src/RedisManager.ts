import { payload } from "@repo/types";
import { createClient, RedisClientType } from "redis"
import "dotenv/config";

export default class RedisManager {
	private client: RedisClientType;
	private publisher: RedisClientType;
	private static instance: RedisManager;
	private constructor() {
		this.client = createClient({
			url: process.env.REDIS_URL
		});
		this.publisher = createClient({
			url: process.env.REDIS_URL
		});
		const connect = async () => {
			try {
				this.client.connect()
				this.publisher.connect()
			} catch (e) {
				console.log("Redis Client not connected, retrying.")
				connect()

			}
		}
		connect()
	}
	static getInstance() {
		if (!RedisManager.instance) {
			const instance = new RedisManager()
			RedisManager.instance = instance;
		}
		return RedisManager.instance;
	}
	async getFromQueue(): Promise<({ key: "submission" | "time_control", element: string })> {
		return new Promise((resolve) => {
			this.client.brPop(["submission", "time_control"], 0).then((response) => {
				if (!response) {
					throw new Error("No Response!")
				}
				resolve({ key: response.key as "submission" | "time_control", element: response.element })
			})
		})
	}
	// Todo: Typecasing for sending to api back
	publish(id: string, response: any) {
		this.publisher.publish(id, JSON.stringify(response))
	}
}
