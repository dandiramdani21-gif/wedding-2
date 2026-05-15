import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email wajib diisi' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json({
        message: 'Jika email terdaftar, link reset password akan dikirim'
      });
    }

    // Delete existing reset tokens for this email
    await prisma.passwordReset.deleteMany({ where: { email } });

    // Create new reset token (expires in 1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: { email, token, expiresAt }
    });

    // In production, you would send email here
    // For now, we'll log the reset link (you can implement email sending later)
    const resetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    console.log(`[PASSWORD RESET] Token for ${email}: ${resetLink}`);

    // TODO: Implement email sending here using your preferred email service
    // Example with nodemailer:
    // await sendEmail({
    //   to: email,
    //   subject: 'Reset Password - Wedding Package',
    //   html: `Klik link berikut untuk reset password: <a href="${resetLink}">Reset Password</a>`
    // });

    return NextResponse.json({
      message: 'Jika email terdaftar, link reset password akan dikirim'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}