import prisma from "@/app/libs/prisma";

const getMessages = async (
	convId: string
) => {
	try {
		const messages = await prisma.message.findMany({
			where: {
				convId: convId
			},
			include: {
				sender: true,
				seen: true,
			},
			orderBy: {
				createdAt: 'asc'
			}
		});

		return messages;
	} catch (error: any) {
		return [];
	}
};

export default getMessages;