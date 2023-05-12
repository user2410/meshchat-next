import bcrypt from 'bcrypt';

import prisma from "@/app/libs/prisma";
import { NextResponse } from 'next/server';

const hashRound: number = 10;

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, name, password } = body;

		if (!email || !name || !password) {
			return new NextResponse('Missing info', { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, hashRound);

		const user = await prisma.user.create({
			data: {
				email,
				name,
				hashedPassword
			}
		});

		user.hashedPassword = null;
		return NextResponse.json(user);
	} catch (err) {
		console.error('[REGISTRATION_ERROR]:', err);
		return new NextResponse('Internal Error', { status: 500 });
	}

}