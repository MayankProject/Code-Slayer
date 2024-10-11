import { WebSocketServer } from "ws";
import { UsersManager } from "./UserManager";
import RedisManager from "./RedisManager";

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

console.log(process.env.REDIS_URL);
const wss = new WebSocketServer({ port: 3002 });
UsersManager.getInstance()
RedisManager.getInstance()
wss.on("connection", (ws) => {
	console.log("New user connected")
	UsersManager.getInstance().addUser(ws);
});

