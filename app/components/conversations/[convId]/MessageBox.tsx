"use client";

import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Avatar from "../../Avatar";
import { format } from "date-fns";
import Image from "next/image";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
	data: FullMessageType;
	isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
	const session = useSession();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const isOwn = session?.data?.user?.email === data?.sender?.email;
	const seenList = (data.seen || [])
		.filter((user) => user.email !== data?.sender?.email)
		.map((user) => user.name)
		.join(", ");
	const { convId } = useConversation();

	useEffect(() => {
		axios.put(`/api/conversations/${convId}/seen`);
	}, [convId]);

	return (
		<div className={clsx("flex gap-3 p-4", isOwn && "justify-end")}>
			<div className={clsx(isOwn && "order-2")}>
				<Avatar user={data.sender} />
			</div>
			<div className={clsx("flex flex-col gap-2", isOwn && "items-end")}>
				<div className="flex items-center gap-1">
					<div className="text-sm text-gray-500">{data.sender.name}</div>
					<div className="text-xs text-gray-400">
						{format(new Date(data.createdAt), "p")}
					</div>
				</div>
				<div
					className={clsx(
						"text-sm w-fit overflow-hidden",
						isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
						data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
					)}
				>
					<ImageModal
						src={data.image}
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
					/>
					{data.image ? (
						<Image
							onClick={() => setIsModalOpen(true)}
							alt="Image message"
							height="288"
							width="288"
							src={data.image}
							className="object-cover cursor-pointer hover:scale-110 transition translate"
						/>
					) : (
						<div>{data.body}</div>
					)}
				</div>
				{isLast && isOwn && seenList.length > 0 && (
					<div className="text-xs font-light text-gray-500">
						{`Seen by ${seenList}`}
					</div>
				)}
			</div>
		</div>
	);
};

export default MessageBox;
