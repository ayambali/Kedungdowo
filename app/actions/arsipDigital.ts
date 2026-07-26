"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getSemuaArsip() {
  return await prisma.arsipDigital.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createArsip(formData: FormData) {
  try {
    const nomor = formData.get("nomor") as string;
    const tahun = parseInt(formData.get("tahun") as string, 10);
    const perihal = formData.get("perihal") as string;
    const isiDokumen = formData.get("isiDokumen") as string;
    const kategori = formData.get("kategori") as string;
    const lokasiSimpan = formData.get("lokasiSimpan") as string;
    const jumlah = parseInt(formData.get("jumlah") as string, 10);
    const file = formData.get("file") as File | null;

    let filePdfUrl: string | null = null;

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Ukuran file PDF maksimal 5MB.");
      }
      if (file.type !== "application/pdf") {
        throw new Error("Format file harus berupa PDF.");
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `arsip/${fileName}`;

      const { data, error } = await supabase.storage
        .from("arsip-dokumen")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (error) {
        throw new Error("Gagal mengunggah file PDF.");
      }

      const { data: publicUrlData } = supabase.storage
        .from("arsip-dokumen")
        .getPublicUrl(filePath);

      filePdfUrl = publicUrlData.publicUrl;
    }

    const newArsip = await prisma.arsipDigital.create({
      data: {
        nomor,
        tahun,
        perihal,
        isiDokumen,
        kategori,
        lokasiSimpan,
        jumlah,
        filePdfUrl,
      },
    });

    revalidatePath("/admin/arsip");
    revalidatePath("/layanan/arsip");
    return { success: true, data: newArsip };
  } catch (error: any) {
    throw new Error(error.message || "Gagal menyimpan data.");
  }
}

export async function editArsip(formData: FormData, id: number) {
  try {
    const nomor = formData.get("nomor") as string;
    const tahun = parseInt(formData.get("tahun") as string, 10);
    const perihal = formData.get("perihal") as string;
    const isiDokumen = formData.get("isiDokumen") as string;
    const kategori = formData.get("kategori") as string;
    const lokasiSimpan = formData.get("lokasiSimpan") as string;
    const jumlah = parseInt(formData.get("jumlah") as string, 10);
    const file = formData.get("file") as File | null;

    const dataToUpdate: any = {
      nomor,
      tahun,
      perihal,
      isiDokumen,
      kategori,
      lokasiSimpan,
      jumlah,
    };

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Ukuran file PDF maksimal 5MB.");
      }
      if (file.type !== "application/pdf") {
        throw new Error("Format file harus berupa PDF.");
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `arsip/${fileName}`;

      const { data, error } = await supabase.storage
        .from("arsip-dokumen")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (error) {
        throw new Error("Gagal mengunggah file PDF.");
      }

      const { data: publicUrlData } = supabase.storage
        .from("arsip-dokumen")
        .getPublicUrl(filePath);

      dataToUpdate.filePdfUrl = publicUrlData.publicUrl;
    }

    const updatedArsip = await prisma.arsipDigital.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/admin/arsip");
    revalidatePath("/layanan/arsip");
    return { success: true, data: updatedArsip };
  } catch (error: any) {
    throw new Error(error.message || "Gagal mengubah data.");
  }
}

export async function deleteArsip(id: number) {
  try {
    await prisma.arsipDigital.delete({
      where: { id },
    });
    revalidatePath("/admin/arsip");
    revalidatePath("/layanan/arsip");
    return { success: true };
  } catch (error: any) {
    throw new Error("Gagal menghapus data.");
  }
}
