import Pane from "@/components/Pane";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import ExampleBody from "@/components/ExampleBody";
import Constraint from "@/components/Constraint";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
