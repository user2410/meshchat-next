import getUser from "@/app/actions/getUsers";
import { UserList } from "@/app/components/UserList";
import { Sidebar } from "@/app/components/sidebar/Sidebar";

export default async function UserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const users = await getUser();

	return (
		// @ts-expect-error Server Comopnent
		<Sidebar>
			<div className="h-full">
				<UserList items={users} />
				{children}
			</div>
		</Sidebar>
	);
}
