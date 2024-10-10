"use client";

export default function Loading() {
	return (

		<div className="p-4 h-screen w-full gap-2 flex flex-1 overflow-scroll resize">
			{/* Problem Description */}
			<div className="w-1/2 h-full bg-gray-700 rounded-md animate-pulse mb-4"></div>
			<div className="flex flex-col flex-1 w-full gap-4">
				{/* Code Editor Pane */}
				<div className="w-full">
					<div className="w-full h-[50vh] bg-gray-700 rounded-md animate-pulse"></div>
				</div>

				{/* Testcases / Console */}
				<div className="w-full h-[50vh] flex flex-col gap-4">
					{/* Toggle between Testcases and Console */}
					<div className="flex gap-2">
						<div className="w-24 h-10 bg-gray-700 rounded-md animate-pulse"></div>
						<div className="w-24 h-10 bg-gray-700 rounded-md animate-pulse"></div>
					</div>

					{/* Testcases / Console Output */}
					<div className="w-full h-full bg-gray-700 rounded-md animate-pulse"></div>
				</div>
			</div>
		</div>

	)

}
