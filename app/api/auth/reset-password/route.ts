import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token dan password wajib diisi' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password minimal 8 karakter' }, { status: 400 });
    }

    // Find the reset record
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token }
    });

    if (!resetRecord) {
      return NextResponse.json({ message: 'Token tidak valid' }, { status: 400 });
    }

    // Check if token is expired
    if (new Date() > resetRecord.expiresAt) {
      return NextResponse.json({ message: 'Token sudah kadaluarsa. Silakan minta reset password kembali.' }, { status: 400 });
    }

    // Check if token was already used
    if (resetRecord.usedAt) {
      return NextResponse.json({ message: 'Token sudah digunakan. Silakan minta reset password kembali.' }, { status: 400 });
    }

    // Update the user's password
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash }
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() }
    });

    return NextResponse.json({
      message: 'Password berhasil direset. Silakan login dengan password baru.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}