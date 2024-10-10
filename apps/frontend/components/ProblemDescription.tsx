import Pane from "@/components/Pane";
import ReactMarkdown from "react-markdown";
export default function ProblemDescription({ description }: { description: string }) {
	return (
		<Pane>
			<div className="prose prose-slate prose-invert p-6" >
				<ReactMarkdown >
					{description}
				</ReactMarkdown>
			</div>
		</Pane>
	)
}	
