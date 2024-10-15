import { useState } from "react";
import roastAppreciationLines from "@/config/passedRoasts";
export default function TestcasePassed() {
    const [jokeIndex, setJokeIndex] = useState(Math.floor(Math.random() * roastAppreciationLines.length));
    return (
        <div className="text-[#2CBB5D] bg-[#01ea3014] rounded-xl w-full h-[80%] flex flex-col gap-3 justify-center items-center" >
            <h1 className="text-xl " > All Testcases Passed! </h1>
            <p className="max-w-md text-center" > {roastAppreciationLines[jokeIndex]} </p>
        </div>
    )
}
