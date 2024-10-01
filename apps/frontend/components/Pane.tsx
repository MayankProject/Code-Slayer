export default function Pane({ children, className }: {
	children: React.ReactNode,
	className?: string
}) {
	return <div className={`overflow-scroll m-[4px] bg-dark-layer-1 h-full rounded-lg ${className}`}>
		{children}
	</div>;
}
