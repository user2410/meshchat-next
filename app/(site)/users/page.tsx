import { EmptyState } from "@/app/components/EmptyState";
import React from "react";

export default function User() {
	return (
		<div className="hidden lg:block lg:pl-80 h-full">
			<EmptyState />
		</div>
	);
}
