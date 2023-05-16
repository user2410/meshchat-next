import getConversations from "@/app/actions/getConversations";
import ConversationList from "@/app/components/conversations/ConversationList";
import { Sidebar } from "@/app/components/sidebar/Sidebar";
import React from "react";

const ConversationLayout = async ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const convs = await getConversations();

	return (
		// @ts-expect-error
		<Sidebar>
			<div className="h-full">
				<ConversationList initialItems={convs} />
				{children}
			</div>
		</Sidebar>
	);
};

export default ConversationLayout;
