import { payload } from "@repo/types";
import { createClient, RedisClientType } from "redis"
export default class RedisManager {
	private publisher: RedisClientType;
	private static instance: RedisManager;
	private constructor() {
		// publisher : Pushes data to queue
		this.publisher = createClient();
		this.publisher.connect()
	}
	static getInstance() {
		if (!this.instance) {
			this.instance = new RedisManager();
		}
		return this.instance;
	}

	push(payload: payload) {
		const id = Math.random().toString()
		const updatedPayload = { ...payload, id }
		this.publisher.lPush("submission", JSON.stringify(updatedPayload))
		return id
	}
}
