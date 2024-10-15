import { resultDataState, showResultState } from "@/state";
import { useRecoilValue } from "recoil";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function ReportComponent() {
    const resultData = useRecoilValue(resultDataState);
    const setShowResult = useRecoilValue(showResultState)
    const session = useSession()

    return (
        <div className="absolute flex justify-center items-center !z-[100] w-screen h-screen top-0 left-0 bg-[#0F0D0DA1] backdrop-blur-[2px]" >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }
                }
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex relative flex-col items-center justify-center z-[9999] will-change-transform gap-6 backdrop-blur-xl border border-gray-500/20 rounded-3xl p-8 text-white"
            >
                <div className="font-bold text-[50px]" > {session?.data?.user.name} </div>
                < div className="font-bold text-xl" >
                    Your Score: {resultData?.score} | Best Score: {resultData?.bestScore} | Solved: {resultData?.solved} / {resultData?.solvedOutOf}
                </div>

                <div className="absolute right-6 top-6 text-white hover:scale-[1.1] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </motion.div>
        </div>
    );
}
