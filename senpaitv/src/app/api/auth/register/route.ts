import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const email = String(body?.email || '').trim().toLowerCase();
		const password = String(body?.password || '');
		const username = String(body?.username || '').trim();

		if (!email || !password || !username) {
			return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
		}
		if (!isValidEmail(email)) {
			return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
		}
		if (password.length < 6) {
			return NextResponse.json({ error: 'Password too short' }, { status: 400 });
		}

		await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS local_credentials (
        email TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

		const existing = await prisma.$queryRawUnsafe<any[]>(
			`SELECT email FROM local_credentials WHERE email = $1`,
			email
		);
		if (existing && existing.length > 0) {
			return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
		}

		const salt = crypto.randomBytes(16).toString('hex');
		const hash = crypto.scryptSync(password, salt, 64).toString('hex');

		await prisma.$executeRawUnsafe(
			`INSERT INTO local_credentials (email, username, password_hash, salt) VALUES ($1, $2, $3, $4)`,
			email,
			username,
			hash,
			salt
		);

		await prisma.user.upsert({
			where: { email },
			update: { name: username },
			create: { email, name: username },
		});

		return NextResponse.json({ success: true });
	} catch (e: any) {
		console.error('Register error:', e);
		return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
	}
}


