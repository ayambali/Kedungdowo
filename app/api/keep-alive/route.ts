import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Wajib agar Vercel tidak nge-cache response ini
export const dynamic = 'force-dynamic';

// Proteksi: hanya Vercel Cron yang boleh memanggil endpoint ini
// Vercel mengirim header 'Authorization: Bearer <CRON_SECRET>' pada setiap cron invocation
export async function GET(request: Request) {
  // Verifikasi cron secret (opsional tapi disarankan untuk keamanan)
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { status: 'unauthorized', message: 'Invalid CRON_SECRET' },
      { status: 401 }
    );
  }

  try {
    // Upsert: buat row baru jika belum ada, atau update pingedAt jika sudah ada
    const result = await prisma.keepAlive.upsert({
      where: { id: 1 },
      update: { pingedAt: new Date() },
      create: { id: 1, pingedAt: new Date() },
    });



    return NextResponse.json({
      status: 'ok',
      pingedAt: result.pingedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';


    return NextResponse.json(
      { status: 'error', message },
      { status: 500 }
    );
  }
}
