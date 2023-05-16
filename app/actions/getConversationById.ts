import prisma from "@/app/libs/prisma";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (
	convId: string
) => {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser?.email) {
			return null;
		}

		const conversation = await prisma.conversation.findFirst({
			where: {
				id: convId
			},
			include: {
				users: true,
			},
		});

		return conversation;
	} catch (err) {
		console.log(err)
		return null;
	}
};

export default getConversationById;