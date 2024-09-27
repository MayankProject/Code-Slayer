type payload = {
	method: string,
	param: {
		type: "token" | "room",
		key: string
	}
}
export class WebSocketManager {
	private static instance: WebSocketManager
	private socket: WebSocket
	private bufferedMessage: payload[] = []
	private initialized: boolean = false
	private callbacks: { [key: string]: ((data: any) => void)[] } = {}
	private solutionCallbacks: Map<string, ((data: any) => void)> = new Map()
	private constructor() {
		this.socket = new WebSocket("ws://localhost:3002")
		this.init()
	}
	static getInstance() {
		if (!this.instance) {
			this.instance = new WebSocketManager()
		}
		return this.instance
	}
	sendMessage(message: payload) {
		console.log(message)
		if (!this.initialized) {
			this.bufferedMessage.push(message)
			return
		}
		this.socket.send(JSON.stringify(message))
	}
	attachSolutionCallback(id: string, callback: (data: any) => void) {
		this.solutionCallbacks.set(id, callback)
	}
	attachCallback(stream: string, callback: (data: any) => void) {
		if (this.callbacks[stream]) {
			this.callbacks[stream].push(callback)
			return
		}
		this.callbacks[stream] = [callback]
	}
	detachCallback(stream: string, callback: (data: any) => void) {
		this.callbacks[stream] = this.callbacks[stream].filter(call => call !== callback)
	}
	handleIncomingData(data: any) {
		if (data.e === "SUBMISSION") {
			const callback = this.solutionCallbacks.get(data.id)
			if (callback) {
				callback(data)
				this.solutionCallbacks.delete(data.id)
			}
		}
		if (this.callbacks[data.e]) {
			this.callbacks[data.e].forEach((callback) => {
				callback(data)
			})
		}
	}
	init() {
		this.socket.onopen = () => {
			this.initialized = true
			this.bufferedMessage.forEach((message) => {
				this.socket.send(JSON.stringify(message))
			})
		}
		this.socket.addEventListener("message", (data: any) => {
			this.handleIncomingData(JSON.parse(data.data.toString()))
		})
	}
}
