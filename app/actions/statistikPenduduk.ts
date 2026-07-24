'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Fetch all statistics grouped by category
export async function getStatistikPenduduk() {
  // Proactively run migration updates to match user's requested education levels
  const hasOldLabels = await prisma.statistikPenduduk.findFirst({
    where: {
      OR: [
        { label: 'Belum/Tidak/Sudah Tidak Sekolah' },
        { label: 'SLTP' },
        { label: 'SLTA / SMK' },
      ],
    },
  });

  if (hasOldLabels) {
    await prisma.statistikPenduduk.updateMany({
      where: { kategori: 'Tingkat Pendidikan', label: 'Belum/Tidak/Sudah Tidak Sekolah' },
      data: { label: 'Belum/Tidak Sekolah' }
    });
    await prisma.statistikPenduduk.updateMany({
      where: { kategori: 'Tingkat Pendidikan', label: 'SLTP' },
      data: { label: 'SMP' }
    });
    await prisma.statistikPenduduk.updateMany({
      where: { kategori: 'Tingkat Pendidikan', label: 'SLTA / SMK' },
      data: { label: 'SMA/SMK' }
    });
  }

  const data = await prisma.statistikPenduduk.findMany({
    orderBy: [
      { kategori: 'asc' },
      { label: 'asc' },
    ],
  });

  // Group by kategori
  const grouped: Record<string, { id: number; label: string; jumlah: number }[]> = {};
  
  data.forEach((item: any) => {
    if (!grouped[item.kategori]) {
      grouped[item.kategori] = [];
    }
    grouped[item.kategori].push({
      id: item.id,
      label: item.label,
      jumlah: item.jumlah,
    });
  });

  return grouped;
}

// Fetch single stat item
export async function getStatistikPendudukById(id: number) {
  return await prisma.statistikPenduduk.findUnique({
    where: { id },
  });
}

// Create new stat entry
export async function createStatistikPenduduk(formData: FormData) {
  const kategori = formData.get('kategori') as string;
  const label = formData.get('label') as string;
  const jumlah = parseInt(formData.get('jumlah') as string, 10);

  if (!kategori || !label || isNaN(jumlah)) {
    throw new Error('Semua field harus diisi dengan benar');
  }

  await prisma.statistikPenduduk.create({
    data: {
      kategori,
      label,
      jumlah,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/penduduk');
  revalidatePath('/profil');
}

// Update existing stat entry
export async function updateStatistikPenduduk(id: number, formData: FormData) {
  const jumlah = parseInt(formData.get('jumlah') as string, 10);

  if (isNaN(jumlah)) {
    throw new Error('Jumlah harus berupa angka');
  }

  // We only allow updating the "jumlah" (count) to keep it simple,
  // or allow label update as well if needed. Let's just update both label and jumlah.
  const label = formData.get('label') as string;

  const dataToUpdate: any = { jumlah };
  if (label) {
    dataToUpdate.label = label;
  }

  await prisma.statistikPenduduk.update({
    where: { id },
    data: dataToUpdate,
  });

  revalidatePath('/admin');
  revalidatePath('/admin/penduduk');
  revalidatePath('/profil');
}

// Delete stat entry
export async function deleteStatistikPenduduk(id: number) {
  await prisma.statistikPenduduk.delete({
    where: { id },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/penduduk');
  revalidatePath('/profil');
}

// Seed basic categories if database is empty
// Seed basic categories
export async function seedStatistikPenduduk() {
  const existingFasilitas = await prisma.statistikPenduduk.findFirst({
    where: { kategori: 'Fasilitas Pendidikan' }
  });

  if (existingFasilitas) return;
  
  const existingPenduduk = await prisma.statistikPenduduk.findFirst();
  if (!existingPenduduk) {
    const defaultPendudukData = [
      { kategori: 'Ringkasan Demografi', label: 'Total Kepala Keluarga (KK)', jumlah: 1168 },
      { kategori: 'Jenis Kelamin', label: 'Laki-laki', jumlah: 1765 },
      { kategori: 'Jenis Kelamin', label: 'Perempuan', jumlah: 1603 },
      { kategori: 'Agama', label: 'Islam', jumlah: 3362 },
      { kategori: 'Agama', label: 'Kristen', jumlah: 6 },
      { kategori: 'Agama', label: 'Katolik', jumlah: 0 },
      { kategori: 'Agama', label: 'Hindu', jumlah: 0 },
      { kategori: 'Agama', label: 'Buddha', jumlah: 0 },
      { kategori: 'Agama', label: 'Konghucu', jumlah: 0 },
      { kategori: 'Pekerjaan', label: 'Karyawan Swasta', jumlah: 511 },
      { kategori: 'Pekerjaan', label: 'Petani', jumlah: 451 },
      { kategori: 'Pekerjaan', label: 'Wiraswasta', jumlah: 422 },
      { kategori: 'Pekerjaan', label: 'Buruh Tani', jumlah: 415 },
      { kategori: 'Pekerjaan', label: 'Lain-lain', jumlah: 56 },
      { kategori: 'Pekerjaan', label: 'Perdagangan', jumlah: 53 },
      { kategori: 'Pekerjaan', label: 'Buruh Harian Lepas', jumlah: 50 },
      { kategori: 'Pekerjaan', label: 'Pensiunan', jumlah: 25 },
      { kategori: 'Pekerjaan', label: 'Pegawai Negeri', jumlah: 17 },
      { kategori: 'Tingkat Pendidikan', label: 'Belum/Tidak Sekolah', jumlah: 968 },
      { kategori: 'Tingkat Pendidikan', label: 'SD', jumlah: 1024 },
      { kategori: 'Tingkat Pendidikan', label: 'SMP', jumlah: 626 },
      { kategori: 'Tingkat Pendidikan', label: 'SMA/SMK', jumlah: 691 },
      { kategori: 'Tingkat Pendidikan', label: 'Perguruan Tinggi', jumlah: 61 },
      { kategori: 'Kelompok Umur', label: '0 Bln – 4 Thn', jumlah: 193 },
      { kategori: 'Kelompok Umur', label: '5 Thn – 9 Thn', jumlah: 231 },
      { kategori: 'Kelompok Umur', label: '10 Thn – 14 Thn', jumlah: 238 },
      { kategori: 'Kelompok Umur', label: '15 Thn – 19 Thn', jumlah: 238 },
      { kategori: 'Kelompok Umur', label: '20 Thn – 24 Thn', jumlah: 308 },
      { kategori: 'Kelompok Umur', label: '25 Thn – 29 Thn', jumlah: 224 },
      { kategori: 'Kelompok Umur', label: '30 Thn – 34 Thn', jumlah: 224 },
      { kategori: 'Kelompok Umur', label: '35 Thn – 39 Thn', jumlah: 235 },
      { kategori: 'Kelompok Umur', label: '40 Thn – 44 Thn', jumlah: 203 },
      { kategori: 'Kelompok Umur', label: '45 Thn – 49 Thn', jumlah: 213 },
      { kategori: 'Kelompok Umur', label: '50 Thn – 54 Thn', jumlah: 229 },
      { kategori: 'Kelompok Umur', label: '55 Thn – 59 Thn', jumlah: 215 },
      { kategori: 'Kelompok Umur', label: '60 Tahun keatas', jumlah: 617 },
      { kategori: 'Kesejahteraan Warga (KK)', label: 'Keluarga Kaya', jumlah: 90 },
      { kategori: 'Kesejahteraan Warga (KK)', label: 'Keluarga Sedang', jumlah: 389 },
      { kategori: 'Kesejahteraan Warga (KK)', label: 'Keluarga Miskin', jumlah: 547 },
      { kategori: 'Kesejahteraan Warga (KK)', label: 'Sangat Miskin', jumlah: 0 },
      { kategori: 'Ketenagakerjaan', label: 'Total Angkatan Kerja (Usia 15-55 thn)', jumlah: 2010 },
      { kategori: 'Ketenagakerjaan', label: 'Belum Bekerja / Pengangguran', jumlah: 408 },
      { kategori: 'Sebaran Dusun', label: 'Dusun Kedungori', jumlah: 0 },
      { kategori: 'Sebaran Dusun', label: 'Dusun Kedung Lengkong', jumlah: 0 },
      { kategori: 'Sebaran Dusun', label: 'Dusun Jatisari', jumlah: 0 },
      { kategori: 'Sebaran Dusun', label: 'Dusun Kedungdowo', jumlah: 0 },
    ];
    for (const item of defaultPendudukData) {
      try {
        await prisma.statistikPenduduk.upsert({
          where: { kategori_label: { kategori: item.kategori, label: item.label } },
          update: {},
          create: item
        });
      } catch (e) { /* ignore race conditions */ }
    }
  }

  const defaultFasilitasData = [
    { kategori: 'Fasilitas Pendidikan', label: 'PAUD / TK', jumlah: 2 },
    { kategori: 'Fasilitas Pendidikan', label: 'SD / MI', jumlah: 3 },
    { kategori: 'Fasilitas Pendidikan', label: 'TPA / TPQ / Madin', jumlah: 7 },
    { kategori: 'Fasilitas Kesehatan', label: 'Posyandu', jumlah: 6 },
    { kategori: 'Fasilitas Kesehatan', label: 'Polindes', jumlah: 1 },
    { kategori: 'Fasilitas Kesehatan', label: 'Bidan Desa', jumlah: 1 },
    { kategori: 'Fasilitas Publik', label: 'Tempat Ibadah', jumlah: 16 },
    { kategori: 'Fasilitas Publik', label: 'Lapangan Olahraga', jumlah: 4 },
  ];

  for (const item of defaultFasilitasData) {
    try {
      await prisma.statistikPenduduk.upsert({
        where: { kategori_label: { kategori: item.kategori, label: item.label } },
        update: {},
        create: item
      });
    } catch (e) { /* ignore race conditions */ }
  }
}
