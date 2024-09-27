export default function Error({ text }: { text: string }) {
	return (
		<div className="text-destructive" >
			<h1 className="text-xl " > Error </h1>
			< div className="group my-2 font-menlo relative rounded-lg bg-[rgba(246,54,54,0.08)] px-3 py-4 dark:bg-[rgba(248,97,92,0.08)] whitespace-pre-wrap break-all text-xs text-red-60 dark:text-red-60" >
				{text}
			</div>
		</div>
	);
}
