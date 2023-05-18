"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import React, { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
	initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
	const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
	const bottomRef = useRef<HTMLDivElement>(null);

	const { convId } = useConversation();

	useEffect(() => {
		axios.put(`/api/conversations/${convId}/seen`);
	}, [convId]);

	useEffect(() => {
		pusherClient.subscribe(convId);
		bottomRef?.current?.scrollIntoView();

		const messageHandler = (message: FullMessageType) => {
			axios.put(`/api/conversations/${convId}/seen`);

			setMessages((current) => {
				if (find(current, { id: message.id })) {
					return current;
				}

				return [...current, message];
			});

			bottomRef?.current?.scrollIntoView();
		};

		const updateMessageHandler = (newMessage: FullMessageType) => {
			setMessages((current) =>
				current.map((currentMessage) => {
					if (currentMessage.id === newMessage.id) {
						return newMessage;
					}

					return currentMessage;
				})
			);
		};

		pusherClient.bind("messages:new", messageHandler);
		pusherClient.bind("message:update", updateMessageHandler);

		return () => {
			pusherClient.unsubscribe(convId);
			pusherClient.unbind("messages:new", messageHandler);
			pusherClient.unbind("message:update", updateMessageHandler);
		};
	}, [convId]);

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
