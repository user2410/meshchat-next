import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prisma";

interface Props {
	convId: string;
}

export async function DELETE(req: Request, { params }: { params: Props }) {
	try {
		const { convId } = params;
		const currentUser = await getCurrentUser();
		console.log(convId);

		if (!currentUser?.id) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const currentConv = await prisma.conversation.findFirst({
			where: {
				id: convId
			},
			include: {
				users: true
			}
		});

		if (!currentConv) {
			return new NextResponse('Invalid ID', { status: 400 });
		}

		const deletedConv = await prisma.conversation.delete({
			where: {
				id: convId,
			}
		});

		return NextResponse.json(deletedConv);
	} catch (err) {
		console.log(err, 'ERROR_CONVERSATION_DELETE');
		return new NextResponse('Error', { status: 500 });
	}
}