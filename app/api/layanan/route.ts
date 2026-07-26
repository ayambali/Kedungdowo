import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST: Simpan data layanan baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kategori, namaPemohon, kontak, perihal } = body;

    // Validasi: semua field wajib diisi
    if (!kategori || !namaPemohon || !kontak || !perihal) {
      return NextResponse.json(
        { success: false, message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    const data = await prisma.layananPublik.create({
      data: { kategori, namaPemohon, kontak, perihal },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Permohonan berhasil dikirim. Perangkat desa akan segera menindaklanjuti.",
        data,
      },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.",
      },
      { status: 500 }
    );
  }
}

// GET: Ambil daftar permohonan (tanpa kolom kontak untuk privasi)
export async function GET() {
  try {
    const data = await prisma.layananPublik.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        kategori: true,
        namaPemohon: true,
        perihal: true,
        tanggapan: true,
        status: true,
        createdAt: true,
        // kontak TIDAK di-select demi privasi
      },
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
