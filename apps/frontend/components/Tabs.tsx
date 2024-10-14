import { currentProblem } from "@/state";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { AnimatePresence, motion } from "framer-motion"
export default function Tabs({ TabHead, TabContent }: {
    TabHead: {
        title: string,
        key: string
    }[],
    TabContent: {
        key: string,
        content: React.ReactNode
    }[]
}) {
    const problemIndex = useRecoilValue(currentProblem);

    useEffect(() => {
        setTabSelect(TabHead[0]?.key ?? "");
    }, [problemIndex, TabHead]);
    const [tabSelect, setTabSelect] = useState<string>(TabHead[0]?.key ?? "");
    const [instanceId] = useState<number>(Math.random())
    const [TabID, setTabId] = useState<number>(0)
    return (
        <>
            <div className="flex items-center gap-4" >
                {
                    TabHead.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setTabSelect(tab.key)
                                setTabId(index)
                            }
                            }
                            className={`relative transition-200 mb-4 px-4 py-[4px] rounded-xl ${tabSelect === tab.key ? "text-white" : "text-gray-400"}`}
                        >
                            <span className="relative z-20" >
                                {tab.title}
                            </span>
                            {tabSelect === tab.key && (
                                <AnimatePresence>
                                    <motion.span
                                        animate={{ scale: [1, 1.5, 1] }}
                                        layout
                                        layoutId={`bubble-${instanceId}`}
                                        className="absolute bg-[#1E293B] inset-0 z-10"
                                        style={{ borderRadius: 9999 }}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                                    />
                                </AnimatePresence>
                            )}
                        </button>
                    ))
                }
            </div>
            {
                <motion.div
                    className="hidden md:block h-full overflow-hidden px-4">
                    <motion.span className="flex max-w-full h-full pl-2 gap-5"
                        animate={{
                            x: TabID * -100 + (TabID == 0 ? -2 : +0) + "%",
                            transition: { type: "spring", bounce: 0.2, duration: 0.8 }
                        }}>
                        {TabContent.map((tab, index) => (
                            <div
                                key={index}
                                className="min-w-full h-full"
                            >
                                {tab.content}
                            </div>
                        ))}
                    </motion.span>
                </motion.div>
            }
        </>
    );
}
