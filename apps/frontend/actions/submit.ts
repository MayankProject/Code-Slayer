"use server";
import { WebSocketManager } from "@/WebsocketManager";
import RedisManager from "../RedisManager";
import { payload } from "@repo/types";

const redis = RedisManager.getInstance();
const ws = WebSocketManager.getInstance();
export default async function submit(payload: payload) {
	const id = redis.push(payload);
	return id
}
