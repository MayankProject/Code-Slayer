"use client";
export default function Loading() {
    return <div className="p-3 h-1 w-full min-h-screen bg-gradient-to-br" >
        <div className="flex h-full w-full gap-3" >
            <div className="h-full w-1/4 flex flex-col gap-3" >
                <div className="flex flex-col flex-1 gap-2 backdrop-blur-xl border rounded-lg p-3 border-gray-500/20" >
                    {
                        Array(5).fill("").map((_, index) => (
                            <div key={index} className="border flex justify-between rounded-lg px-6 py-3 bg-[#111111] border-gray-500/20 animate-pulse" >
                                <div className="flex gap-2" >
                                    <div className="h-3 w-16 bg-gray-700 rounded" > </div>
                                    < div className="h-3 w-8 bg-gray-700 rounded" > </div>
                                </div>
                                < div className="h-3 w-10 bg-gray-700 rounded" > </div>
                            </div>
                        ))
                    }
                </div>
                < div className="bg-[#111111] text-center p-3 w-full rounded-lg animate-pulse border border-[#2CBB5D]" >
                    <div className="h-3 w-16 mx-auto bg-gray-700 rounded" > </div>
                </div>
            </div>
            < div className="h-full w-3/4 flex flex-col gap-3" >
                <div className="flex backdrop-blur-xl border text-sm rounded-lg px-6 py-3 text-gray-400 border-gray-500/20 animate-pulse" >
                    <div className="flex gap-2 items-center" >
                        <div className="w-2 h-2 bg-gray-700 rounded-full" > </div>
                        < div className="h-3 w-32 bg-gray-700 rounded" > </div>
                    </div>
                </div>
                < div className="flex justify-center items-center flex-1 backdrop-blur-xl border text-sm rounded-lg text-gray-400 border-gray-500/20 animate-pulse" >
                    <div className="h-12 w-12 bg-gray-700 rounded-full" > </div>
                </div>
            </div>
        </div>
    </div>
}

