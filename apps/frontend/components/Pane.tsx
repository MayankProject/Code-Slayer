export default function Pane({ children }: any) {
	return <div className="overflow-scroll m-[4px] bg-dark-layer-1 h-full rounded-lg" >
		{ children }
		</div>;
}
