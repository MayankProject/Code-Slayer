export default function Container({ children }: { children: React.ReactNode }) {
	return <div className="container p-3 w-full min-h-screen" > { children } </div>;
}
