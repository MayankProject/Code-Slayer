import WebSocket from "ws"
import RedisManager from "./RedisManager"
export class SubscriptionManager {
	private static instance: SubscriptionManager
	private Subscriptions = new Map<string, WebSocket[]> // stream -> User[] 
	private reverseSubscription = new Map<WebSocket, string[]> // User -> stream[]
	private constructor() {
	}
	static getInstance() {
		if (!this.instance) {
			this.instance = new SubscriptionManager()
		}
		return this.instance
	}
	Subscribe(ws: WebSocket, stream: string) {
		const streamSub = this.Subscriptions.get(stream) || []
		const userSub = this.reverseSubscription.get(ws) || []
		if (!(streamSub.length)) {
			RedisManager.getInstance().subscribe(stream, SubscriptionManager.instance)
		}
		this.Subscriptions.set(stream, [...streamSub, ws])
		this.reverseSubscription.set(ws, [...userSub, stream])
	}
	Unsubscribe(ws: WebSocket, stream: string) {
		const streamSub = this.Subscriptions.get(stream) || []
		const userSub = this.reverseSubscription.get(ws) || []
		if (streamSub.length === 1) {
			RedisManager.getInstance().unsubscribe(stream)
		}
		this.Subscriptions.set(stream, streamSub.filter(e => e !== ws))
		this.reverseSubscription.set(ws, userSub.filter(e => e !== stream))
	}
	removeUser(ws: WebSocket) {
		(this.reverseSubscription.get(ws) || []).forEach((stream) => {
			this.Unsubscribe(ws, stream)
		})
		this.reverseSubscription.delete(ws)
	}
	getSubscrbedData(message: string, channel: string) {
		const Users = this.Subscriptions.get(channel) || []
		for (let i = 0; i < Users.length; i++) {
			const User = Users[i]
			User.send(message)
		}
	}
}
