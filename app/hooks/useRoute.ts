import { usePathname } from "next/navigation"
import useConversation from "./useConversation";
import { useMemo } from "react";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { signOut } from "next-auth/react";

const useRoute = () => {
	const pathname = usePathname();
	const { convId } = useConversation();

	const routes = useMemo(() => [
		{
			label: 'Chat',
			href: '/conversations',
			icon: HiChat,
			active: pathname === '/conversations' || !!convId
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
	], [pathname, convId]);

	return routes;
}

export default useRoute;