import { User } from "@prisma/client";
import { FullConversationType } from "../types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const useOtherUser = (conv: FullConversationType | { users: User[] }) => {
	const session = useSession();

	return useMemo(() => {
		const currentUserEmail = session?.data?.user?.email;
		const otherUsers = conv.users.filter((user) => user.email !== currentUserEmail);
		return otherUsers[0];
	}, [session?.data?.user?.email, conv.users]);
}

export default useOtherUser;