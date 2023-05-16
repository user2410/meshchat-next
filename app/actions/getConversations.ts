import getCurrentUser from "./getCurrentUser"
import prisma from "@/app/libs/prisma";

const getConversations = async () => {
	const currentUser = await getCurrentUser();

	if (!currentUser?.id) {
		return [];
	}

	try {
		const convs = await prisma.conversation.findMany({
			orderBy: {
				lastMessageAt: 'desc'
			},
			where: {
				userIds: {
					has: currentUser.id
				}
			},
			include: {
				users: true,
				messages: {
					include: {
						sender: true,
						seen: true,
					}
				},
			}
		})
		return convs;
	} catch (err) {
		return [];
	}
};

export default getConversations;