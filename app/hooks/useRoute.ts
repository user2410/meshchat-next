import { usePathname } from "next/navigation"
import useConversation from "./useConversation";
import { useMemo } from "react";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { signOut } from "next-auth/react";

const useRoute = () => {
	const pathname = usePathname();
	const { conversationId } = useConversation();

	const routes = useMemo(() => [
		{
			label: 'Chat',
			href: '/convs',
			icon: HiChat,
			active: pathname === '/convs' || !!conversationId
		},
		{
			label: 'Users',
			href: '/users',
			icon: HiUsers,
			active: pathname === '/users'
		},
		{
			label: 'Logout',
			onClick: () => signOut(),
			href: '#',
			icon: HiArrowLeftOnRectangle,
		},
	], [pathname, conversationId]);

	return routes;
}

export default useRoute;