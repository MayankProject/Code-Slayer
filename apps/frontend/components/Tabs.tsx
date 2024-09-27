import { useState } from "react";
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
	const [tabSelect, setTabSelect] = useState<string>(TabHead[0]?.key ?? "");
	return (
		<>
			<div className="flex items-center gap-4">
				{
					TabHead.map((tab, index) => (
						<button
							key={index}
							onClick={() => { setTabSelect(tab.key) }}
							className={`relative bg-[#FFFFFF1A] transition-200 mb-4 px-4 py-[4px] rounded-xl ${tabSelect === tab.key ? "text-white" : "text-gray-400"}`}
						>
							<span className="relative z-20">
								{tab.title}
							</span>
						</button>
					))
				}
			</div>
			<div className="block overflow-hidden">
				{
					TabContent.map((tab, index) => (
						<div
							key={index}
							className={`${tabSelect === tab.key ? "block" : "hidden"}`}
						>
							{tab.content}
						</div>
					))
				}
			</div>
		</>
	);
}
