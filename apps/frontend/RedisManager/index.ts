import { payload } from "@repo/types";
import { createClient, RedisClientType } from "redis"
import 'dotenv/config';

export default class RedisManager {
	private client: RedisClientType;
	private publisher: RedisClientType;
	private static instance: RedisManager;
	private constructor() {
		console.log("Creating Redis Client", process.env.REDIS_URL)
		// publisher : Pushes data to queue
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
				console.log("Redis Connected.")
			} catch (e) {
				console.log("Redis Client not connected, retrying.")
				connect()
			}
		}
		connect()
	}
	static getInstance() {
		if (!this.instance) {
			this.instance = new RedisManager();
		}
		return this.instance;
	}
	publish(token: string, gameEventPayload: any) {
		console.log("Publishing", gameEventPayload)
		this.publisher.publish(token, JSON.stringify(gameEventPayload))
	}
	push(e: string, payload: payload | { token: string }) {
		const id = Math.random().toString()
		const updatedPayload = { ...payload, id }
		this.client.lPush(e, JSON.stringify(updatedPayload))
		return id
	}

}
