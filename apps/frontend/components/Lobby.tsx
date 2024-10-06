"use client";
import { useSession } from "next-auth/react";
import Container from "./Container";
import JoinArena from "@/actions/join-arena";
import assert from "assert";
import { useEffect, useState } from "react";
import { WebSocketManager } from "@/WebsocketManager";
import { useRouter } from "next/navigation";
import startArena from "@/actions/start-arena";
import { toast } from "react-toastify";
interface User {
	name: string | null,
	id: number,
	admin: boolean,
	rank: number | undefined
}
const ws = WebSocketManager.getInstance();
export default function Lobby({ data, token }: { data: User[], token: string }) {
	const [Users, setUser] = useState<User[]>(data);
	const [isJoined, setIsJoined] = useState<Boolean | undefined>(undefined);
	const session = useSession();
	const allUsersId = Users.map((user) => user.id);
	const router = useRouter();
	const isAdmin = Users.find((user) => user.id === session?.data?.user.id)?.admin;

	const userJoinCallback = (message: any) => {

		if (message.userId === session?.data?.user.id) {
			return;
		}
		toast.success(`${message.name} joined the arena!`);
		setUser((Users) => [...Users, { name: message.name, id: message.userId, admin: false, rank: undefined }]);
	}

	const arenaStartingCallback = (message: any) => {
		assert(message.id === token, "Invalid token");
		if (!isAdmin) {
			toast.success("Arena started! Redirecting...");
			redirect();
		}
	}
	useEffect(() => {
		ws.attachCallback("JOIN_ARENA", userJoinCallback);
		return () => {
			ws.detachCallback("JOIN_ARENA", userJoinCallback);
		}
	}, [session])

	useEffect(() => {
		if (isJoined) {
			ws.attachCallback("START_ARENA", arenaStartingCallback);
		}
		return () => {
			ws.detachCallback("START_ARENA", arenaStartingCallback);
		}
	}, [isJoined]);

	if (session?.data?.user.id && isJoined === undefined) {
		setIsJoined(allUsersId.includes(session?.data?.user.id));
	}
	function redirect() {
		router.push(`/arena/${token}/battle`);
	}
	const _startArena = () => toast.promise(async () => {
		await startArena(token);
		router.push(`/arena/${token}/battle`);
	}, {
		pending: "Starting Arena...",
		success: "Started! Redirecting...",
		error: "Oopsie Daisy! Something went wrong...",
	});
	const _JoinArena = () => toast.promise(new Promise(async (resolve, reject) => {
		assert(session?.data, "Session not found");
		const userId = session?.data?.user.id;
		const name = session?.data?.user.name;
		const status = await JoinArena(token);

		setUser((Users) => [...Users, { name: name, id: userId, admin: false, rank: undefined }]);
		assert(status, "Failed to join arena!");
		ws.attachCallback("START_ARENA", (message) => {
			assert(message.id === token, "Invalid token");
			redirect();
		});
		setIsJoined(true);
		resolve(true);
	}), {
		pending: "Joining...",
		success: "Joined!",
		error: "Oopsie Daisy! Something went wrong...",
	});
	return (
		<Container>
			<div className="flex justify-center items-center h-full" >
				<div className="bg-[#1E1F22] p-4 flex flex-col gap-4" >
					{
						Users.map((user) => {
							return (
								<div key={user.id} className="text-white cursor-pointer rounded-xl bg-[#292C31] p-3 text-center" >
									<div className="text-white" > {user.name}
										{
											user.admin &&
											<span className="text-white" > ~</span>
										}
										{
											user.rank &&
											<span className="text-white" > #{user.rank} </span>
										}
									</div>
								</div>
							)
						})
					}
					{
						isJoined === false &&
						<button
							onClick={_JoinArena}
							disabled={!session
							}
							className={`relative bg-[#2CBB5D] transition-200 my-2 px-4 py-[6px] rounded-lg  text-white`
							}>
							Join
						</button>
					}
					{
						isAdmin &&
						<button
							onClick={_startArena}
							className={`relative bg-[#2CBB5D] transition-200 my-2 px-4 py-[6px] rounded-lg  text-white`
							}>
							Start
						</button>
					}
				</div>
			</div>
		</Container>
	);
}
