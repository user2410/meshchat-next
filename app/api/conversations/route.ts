import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prisma";

export async function POST(
	request: Request
) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { userId, isGroup, members, name } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (isGroup && (!members || members.length < 2 || !name)) {
			return new NextResponse('Invalid request', { status: 400 });
		}

		if (isGroup) {
			const newConv = await prisma.conversation.create({
				data: {
					name,
					isGroup,
					users: {
						connect: [
							...members.map((member: { value: string }) => ({ id: member.value })),
							{ id: currentUser.id }
						]
					}
				},
				include: {
					users: true,
				}
			});
			return NextResponse.json(newConv);
		}

		// handle 1-1 conversation
		const singleConversation = await prisma.conversation.findFirst({
			where: {
				OR: [
					{
						userIds: {
							equals: [currentUser.id, userId],
						}
					},
					{
						userIds: {
							equals: [userId, currentUser.id],
						}
					},
				],
			}
		});

		if (singleConversation) {
			return NextResponse.json(singleConversation);
		}

		const newConversation = await prisma.conversation.create({
			data: {
				users: {
					connect: [
						{ id: currentUser.id },
						{ id: userId },
					]
				}
			},
			include: {
				users: true
			}
		});

		return NextResponse.json(newConversation);
	} catch (err) {
		return new NextResponse('Internal Error', { status: 500 });
	}
}