import { hideNavigationState } from "@/state";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
export default function BottomNavigation({ className }: { className?: string }) {
	const router = useRouter();
	const instanceId = useRef(Math.random()).current;
	const [onHovered, setOnHovered] = useState<number>(0);
	const [hideNavigation, setHideNavigation] = useRecoilState(hideNavigationState);
	const FloatingSpan = () => <motion.span
		animate={{ scale: [1, 1.5, 1] }}
		layout
		layoutId={`bubble-${instanceId}`}
		className="absolute bg-[#1E293B] inset-0  -z-10 px-9 py-5"
		style={{ borderRadius: 9999, opacity: 0.5, translate: "-15% -20%" }}
		transition={{ type: "spring", bounce: 0.2, duration: 0.1 }}
	/>
	useEffect(() => {
		addEventListener("mousemove", (e) => {
			if (e.clientY > window.innerHeight - 100 && e.clientX > window.innerWidth / 2 - 150 && e.clientX < window.innerWidth / 2 + 150) {
				setHideNavigation(false)
			} else {
				setHideNavigation(true)
			}
		})
	}, [])
	return (
		<AnimatePresence>
			<div className={`${className && className} z-[9999] transition-all absolute ${hideNavigation ? "-bottom-[25px] opacity-20" : "bottom-6"} gap-6 flex items-center justify-between backdrop-blur-xl border border-gray-500/20 rounded-3xl px-16 left-[50%] translate-x-[-50%] p-3 text-white`
			} >
				<button className="relative z-20 px-4" onClick={() => {
					router.back()
				}} onMouseEnter={() => setOnHovered(1)} >
					{onHovered === 1 && <FloatingSpan />}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 z-10" >
						<path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
					</svg>
				</button>
				< button className="relative z-20 px-4" onClick={() => {
					router.push(`/`)
				}} onMouseEnter={() => setOnHovered(2)} >
					{onHovered === 2 && <FloatingSpan />}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
						<path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
					</svg>
				</button>
				< button className="relative z-20 px-4" onClick={() => {
					router.forward()
				}} onMouseEnter={() => setOnHovered(3)} >
					{onHovered === 3 && <FloatingSpan />}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
						<path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
					</svg>
				</button>
			</div>
		</AnimatePresence>
	)
}
