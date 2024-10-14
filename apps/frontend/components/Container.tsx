export default function Container({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto p-3 h-1 w-full min-h-screen" > { children } </div>;
}
