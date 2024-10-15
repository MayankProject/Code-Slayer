export default function SolutionLoading() {
    return (
        <div className="flex flex-col justify-center gap-4 w-full h-full">
            <div className="flex gap-2">
                <div className="w-[100px] h-8 bg-gray-700 rounded-xl animate-pulse" > </div>
                <div className="w-[100px] h-8 bg-gray-700 rounded-xl delay-200 animate-pulse" > </div>
                <div className="w-[100px] h-8 bg-gray-700 rounded-xl delay-400 animate-pulse" > </div>
            </div>
            <div className="w-full h-full bg-gray-700 rounded-lg animate-pulse delay-800"></div>
        </div>
    )
}

