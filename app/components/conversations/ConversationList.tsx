"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import getUser from "@/app/actions/getUsers";
import { User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
	users: User[];
	initialItems: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({
	users,
	initialItems,
}) => {
	const [items, setItems] = useState<FullConversationType[]>(initialItems);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const router = useRouter();
	const session = useSession();

	const { convId, isOpen } = useConversation();

	const pusherKey = useMemo(
		() => session.data?.user?.email,
		[session.data?.user?.email]
	);

	useEffect(() => {
		if (!pusherKey) return;
		pusherClient.subscribe(pusherKey);

		function newHandler(conv: FullConversationType) {
			setItems((current) => {
				if (find(current, { id: conv.id })) {
					return current;
				}

				return [conv, ...current];
			});
		}

		function updateHandler(conv: FullConversationType) {
			setItems((current) =>
				current.map((currentConv) => {
					if (currentConv.id === conv.id) {
						return {
							...currentConv,
							messages: conv.messages,
						};
					}

					return currentConv;
				})
			);
		}

		function removeHandler(conv: FullConversationType) {
			setItems((current) =>
				current.filter((currentConv) => currentConv.id !== conv.id)
			);
			if (conv.id === convId) {
				router.push("/conversations");
			}
		}

		pusherClient.bind("conversation:new", newHandler);
		pusherClient.bind("conversation:update", updateHandler);
		pusherClient.bind("conversation:remove", removeHandler);

		return () => {
			pusherClient.unsubscribe(pusherKey);
			pusherClient.unbind("conversation:new", newHandler);
			pusherClient.unbind("conversation:update", updateHandler);
		};
	}, [pusherKey, router, convId]);

	return (
		<>
			<GroupChatModal
				users={users}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
			<aside
				className={clsx(
					"fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
					isOpen ? "hidden" : "block w-full left-0"
				)}
			>
				<div className="px-5">
					<div className="flex justify-between mb-4 pt-4">
						<div className="text-2xl font-bold text-neutral-800">Messages</div>
						<div
							onClick={() => {
								console.log("open modal");
								setIsModalOpen(true);
							}}
							className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              "
						>
							<MdOutlineGroupAdd size={20} />
						</div>
					</div>
					{items.map((item) => (
						<ConversationBox
							key={item.id}
							data={item}
							selected={convId === item.id}
						/>
					))}
				</div>
			</aside>
		</>
	);
};

export default ConversationList;
