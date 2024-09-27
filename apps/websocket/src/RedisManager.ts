import { createClient, RedisClientType } from "redis"
import { SubscriptionManager } from "./SubscriptionManager";
export default class RedisManager {
	private client: RedisClientType;
	private static instance: RedisManager;
	private constructor() {
		this.client = createClient();
		this.connectToRedis()
	}
	static getInstance() {
		if (!this.instance) {
			this.instance = new RedisManager();
		}
		return this.instance;
	}
	connectToRedis = async function(this: RedisManager) {
		await this.client.connect()
		console.log("Redis Connected.")
	}
	subscribe(stream: string, manager: SubscriptionManager) {
		if (stream.startsWith("balance")) {
			// Add Auth Checks
		}
		this.client.subscribe(stream, (message, channel) => {
			manager.getSubscribedData(message, channel)
		})
	}
	unsubscribe(stream: string) {
		this.client.unsubscribe(stream)
	}

}
