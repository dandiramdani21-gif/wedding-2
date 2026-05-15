import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false, message: 'Token tidak ditemukan' }, { status: 400 });
    }

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token }
    });

    if (!resetRecord) {
      return NextResponse.json({ valid: false, message: 'Token tidak valid' }, { status: 400 });
    }

    // Check if token is expired
    if (new Date() > resetRecord.expiresAt) {
      return NextResponse.json({ valid: false, message: 'Token sudah kadaluarsa' }, { status: 400 });
    }

    // Check if token was already used
    if (resetRecord.usedAt) {
      return NextResponse.json({ valid: false, message: 'Token sudah digunakan' }, { status: 400 });
    }

    return NextResponse.json({ valid: true });

  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json({ valid: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}