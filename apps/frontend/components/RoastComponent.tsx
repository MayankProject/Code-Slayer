import tryingRoasts from "@/config/tryingRoasts";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoastComponent() {
    const [currentJokeIndex, setCurrentJokeIndex] = useState(Math.floor(Math.random() * tryingRoasts.length));
    const [previousJokeIndex, setPreviousJokeIndex] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setPreviousJokeIndex(currentJokeIndex);  // Store the previous joke index
            setCurrentJokeIndex(Math.floor(Math.random() * tryingRoasts.length));  // Set the new joke
        }, 10000);
        return () => clearInterval(interval);  // Clean up on component unmount
    }, [currentJokeIndex]);

    return (
        <div className="flex-1 flex-col items-center  w-full h-full">
            <div className="relative w-full h-full">
                <AnimatePresence initial={false}>
                    {previousJokeIndex !== null && (
                        <motion.div
                            key={`previous-${previousJokeIndex}`}  // Unique key for previous joke
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 0, y: -50 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                            className="absolute w-full "
                        >
                            <div className="border border-[#1e1e1e] px-3 py-[7px] rounded-lg text-gray-400">
                                {tryingRoasts[previousJokeIndex]}
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        key={`current-${currentJokeIndex}`}  // Unique key for current joke
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-full "
                    >
                        <div className="border border-[#1e1e1e] px-3 py-[7px] rounded-lg text-gray-400">
                            {tryingRoasts[currentJokeIndex]}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
