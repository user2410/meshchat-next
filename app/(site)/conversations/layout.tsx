import getConversations from "@/app/actions/getConversations";
import getUser from "@/app/actions/getUsers";
import ConversationList from "@/app/components/conversations/ConversationList";
import { Sidebar } from "@/app/components/sidebar/Sidebar";
import React from "react";

const ConversationLayout = async ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const convs = await getConversations();
	const users = await getUser();

	return (
		// @ts-expect-error
		<Sidebar>
			<div className="h-full">
				<ConversationList users={users} initialItems={convs} />
				{children}
			</div>
		</Sidebar>
	);
};

export default ConversationLayout;
