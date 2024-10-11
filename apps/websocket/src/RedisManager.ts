import { createClient, RedisClientType } from "redis"
import { SubscriptionManager } from "./SubscriptionManager";
import "dotenv/config"

export default class RedisManager {
	private client: RedisClientType;
	private publisher: RedisClientType;
	private static instance: RedisManager;
	private constructor() {
		console.log("Creating Redis Client", process.env.REDIS_URL)
		this.client = createClient({
			url: process.env.REDIS_URL
		});
		this.publisher = createClient({
			url: process.env.REDIS_URL
		});
		this.connectToRedis()
	}
	static getInstance() {
		if (!this.instance) {
			this.instance = new RedisManager();
		}
		return this.instance;
	}
	connectToRedis = async function(this: RedisManager) {
		const Connect = async () => {
			await this.client.connect()
			await this.publisher.connect()
			console.log("Redis Connected.")
		}
		try {
			Connect()
		} catch (error) {
			console.log("Redis Client not connected, retrying.")
			this.connectToRedis()
		}
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
