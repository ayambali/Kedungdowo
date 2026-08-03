import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedIdentifier = decodeURIComponent(id).trim();

    const numericId = parseInt(decodedIdentifier, 10);
    let produk = null;

    // 1. Try finding by numeric ID if parameter is purely digits
    if (!isNaN(numericId) && numericId.toString() === decodedIdentifier) {
      produk = await prisma.produkUMKM.findUnique({
        where: { id: numericId },
      });
    }

    // 2. If not found or parameter is a slug/name, match by slug or exact name
    if (!produk) {
      const allProducts = await prisma.produkUMKM.findMany();
      produk =
        allProducts.find(
          (p) =>
            slugify(p.namaProduk) === decodedIdentifier.toLowerCase() ||
            p.namaProduk.toLowerCase() === decodedIdentifier.toLowerCase()
        ) || null;
    }

    if (!produk) {
      return NextResponse.json(
        { error: "Produk UMKM tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: produk,
    });
  } catch (error) {
    console.error("Error fetching UMKM detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data detail produk" },
      { status: 500 }
    );
  }
}
