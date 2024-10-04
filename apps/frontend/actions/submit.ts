"use server";
import { WebSocketManager } from "@/WebsocketManager";
import RedisManager from "../RedisManager";
import { payload } from "@repo/types";

const redis = RedisManager.getInstance();
export default async function submit(payload: payload) {
	const id = redis.push('submission', payload);
	return id
}
