import { Sidebar } from "@/app/components/sidebar/Sidebar";

export default async function UserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// @ts-expect-error Server Comopnent
		<Sidebar>
			<div className="h-full">{children}</div>
		</Sidebar>
	);
}
