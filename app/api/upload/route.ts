import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran gambar maksimal 2MB" }, { status: 400 });
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json({ error: "Format gambar harus JPEG, PNG, atau WEBP" }, { status: 400 });
    }

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = `images/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("arsip-dokumen")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      return NextResponse.json({ error: "Failed to upload file to Supabase" }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("arsip-dokumen")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
  }
}
