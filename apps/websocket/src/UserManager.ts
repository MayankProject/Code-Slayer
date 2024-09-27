import WebSocket from "ws"
import { SubscriptionManager } from "./SubscriptionManager"
export class UsersManager {
	private static instance: UsersManager
	private Users: Map<string, User> = new Map()
	private constructor() {
		SubscriptionManager.getInstance()
	}
	static getInstance() {
		if (!this.instance) {
			this.instance = new UsersManager()
		}
		return this.instance
	}
	addUser(ws: WebSocket) {
		const id = Math.random().toString()
		const user = new User(id, ws)
		this.Users.set(id, user)
	}
	removeUser(id: string) {
		this.Users.delete(id)
	}
}
class User {
	private ws: WebSocket;
	private id: string;
	constructor(id: string, ws: WebSocket) {
		this.ws = ws
		this.id = id
		this.listen()
	}
	listen() {
		this.ws.on("message", (message: string) => {
			this.processRequest(JSON.parse(message))
		})
		this.ws.on("close", () => {
			console.log("User disconnected")
			SubscriptionManager.getInstance().removeUser(this.ws)
			UsersManager.getInstance().removeUser(this.id)
		})
	}
	processRequest(message: {
		method: string,
		param: {
			type: "token" | "room",
			key: string
		}
	}) {
		const Manager = SubscriptionManager.getInstance()
		console.log(message)
		switch (message.method) {
			case "SUBSCRIBE":
				console.log(message, "heyyy")
				Manager.Subscribe(this.ws, message.param.key)
				break;
			case "UNSUBSCRIBE":
				Manager.Unsubscribe(this.ws, message.param.key)
				break;
		}

	}
}
