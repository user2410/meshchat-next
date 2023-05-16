"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import React, { useRef, useState } from "react";
import MessageBox from "./MessageBox";

interface BodyProps {
	initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
	const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
	const bottomRef = useRef<HTMLDivElement>(null);

	const { convId } = useConversation();

	return (
		<div className="flex-1 overflow-y-auto">
			{messages.map((item, index) => (
				<MessageBox
					key={index}
					data={item}
					isLast={index === messages.length - 1}
				/>
			))}
		</div>
	);
};

export default Body;
