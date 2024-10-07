"use client";
import createArena from "@/actions/create-arena";
import Container from "./Container";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const handleArenaCreation = () => toast.promise(async () => {
		const token = await createArena();
		router.push(`/arena/${token}`);
	}, {
		pending: "Creating Arena...",
		success: "Created! Redirecting...",
		error: "Oopsie Daisy! Something went wrong...",
	});
	return (
		<Container>
			<div className="h-full flex flex-col gap-4 justify-center items-center" >
				<div className="flex flex-col gap-2 min-w-[40rem] w-max" >
					<div className="text-2xl border-b border-white w-full p-2" >
						<input type="text" className="w-full outline-none bg-transparent" />
					</div>
					< div className="flex gap-2 w-full rounded-md" >
						<button
							onClick={handleArenaCreation}
							className={`relative bg-[#FFFFFF1A] transition-200 my-2 px-4 py-3 rounded-lg  text-gray-400 flex-1`
							}>
							Create Arena
						</button>
						< button
							className={`relative bg-[#2CBB5D] transition-200 my-2 px-4 py-3 rounded-lg  text-white flex-1`}>
							Join Arena
						</button>
					</div>
				</div>
			</div>
		</Container>
	);
}
