import { createClient, RedisClientType } from "redis"
import { SubscriptionManager } from "./SubscriptionManager";
export default class RedisManager {
	private client: RedisClientType;
	private publisher: RedisClientType;
	private static instance: RedisManager;
	private constructor() {
		this.client = createClient();
		this.publisher = createClient();
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
		await this.publisher.connect()
		console.log("Redis Connected.")
	}
	publish(stream: string, message: string) {
		this.publisher.publish(stream, message)
	}
	subscribe(stream: string, manager: SubscriptionManager) {
		this.client.subscribe(stream, (message, channel) => {
			manager.getSubscrbedData(message, channel)
		})
	}
	unsubscribe(stream: string) {
		this.client.unsubscribe(stream)
	}

}
