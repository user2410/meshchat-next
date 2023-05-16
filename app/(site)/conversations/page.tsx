"use client";

import { EmptyState } from "@/app/components/EmptyState";
import useConversation from "@/app/hooks/useConversation";
import clsx from "clsx";
import React from "react";

const Home = () => {
	const { isOpen } = useConversation();

	return (
		<div
			className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
		>
			<EmptyState />
		</div>
	);
};

export default Home;
