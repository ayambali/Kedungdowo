"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slug"; // Assuming slug function exists or we can just use simple random name

export async function tambahPeraturan(formData: FormData) {
  try {
    const judul = formData.get("judul") as string;
    const nomor = formData.get("nomor") as string;
    const tahun = formData.get("tahun") as string;
    const kategori = formData.get("kategori") as string;
    const isiDokumen = formData.get("isiDokumen") as string;
    const lokasiSimpan = formData.get("lokasiSimpan") as string;
    const jumlah = parseInt((formData.get("jumlah") as string) || "1", 10);
    const file = formData.get("file") as File | null;

    let filePdfUrl: string | null = null;

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: "Ukuran file PDF maksimal 5MB." };
      }
      if (file.type !== "application/pdf") {
        return { success: false, error: "Format file harus berupa PDF." };
      }
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `peraturan/${fileName}`;

      const { data, error } = await supabase.storage
        .from("arsip-dokumen")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        return { success: false, error: "Gagal mengunggah file ke server Supabase." };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("arsip-dokumen")
        .getPublicUrl(filePath);

      filePdfUrl = publicUrlData.publicUrl;
    }

    const newPeraturan = await prisma.peraturanDesa.create({
      data: {
        judul,
        nomor,
        tahun,
        kategori,
        isiDokumen,
        filePdfUrl,
        lokasiSimpan,
        jumlah,
      },
    });

    revalidatePath("/layanan/peraturan-desa");
    revalidatePath("/admin/peraturan-desa");

    return { success: true, data: newPeraturan };
  } catch (error: any) {
    return { success: false, error: "Gagal menyimpan data." };
  }
}

export async function editPeraturan(formData: FormData, id: string) {
  try {
    const judul = formData.get("judul") as string;
    const nomor = formData.get("nomor") as string;
    const tahun = formData.get("tahun") as string;
    const kategori = formData.get("kategori") as string;
    const isiDokumen = formData.get("isiDokumen") as string;
    const lokasiSimpan = formData.get("lokasiSimpan") as string;
    const jumlah = parseInt((formData.get("jumlah") as string) || "1", 10);
    const file = formData.get("file") as File | null;

    const dataToUpdate: any = {
      judul,
      nomor,
      tahun,
      kategori,
      isiDokumen,
      lokasiSimpan,
      jumlah,
    };

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: "Ukuran file PDF maksimal 5MB." };
      }
      if (file.type !== "application/pdf") {
        return { success: false, error: "Format file harus berupa PDF." };
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `peraturan/${fileName}`;

      const { data, error } = await supabase.storage
        .from("arsip-dokumen")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (error) {
        return { success: false, error: "Gagal mengunggah file baru ke Supabase." };
      }

      const { data: publicUrlData } = supabase.storage
        .from("arsip-dokumen")
        .getPublicUrl(filePath);

      dataToUpdate.filePdfUrl = publicUrlData.publicUrl;
    }

    const updated = await prisma.peraturanDesa.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/layanan/peraturan-desa");
    revalidatePath("/admin/peraturan-desa");

    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: "Gagal mengubah data." };
  }
}

export async function hapusPeraturan(id: string) {
  try {
    await prisma.peraturanDesa.delete({ where: { id } });
    revalidatePath("/layanan/peraturan-desa");
    revalidatePath("/admin/peraturan-desa");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Gagal menghapus data." };
  }
}
