import { WebSocketServer } from "ws";
import { UsersManager } from "./UserManager";
import RedisManager from "./RedisManager";

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const wss = new WebSocketServer({ port: 3002 });
UsersManager.getInstance()
RedisManager.getInstance()
wss.on("connection", (ws) => {
    console.log("New user connected")
    UsersManager.getInstance().addUser(ws);
});

