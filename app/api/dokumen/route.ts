import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlBase64 = searchParams.get('url');

  if (!urlBase64) {
    return new NextResponse('URL is required', { status: 400 });
  }

  try {
    const url = Buffer.from(urlBase64, 'base64').toString('utf-8');
    
    // Validasi URL hanya dari supabase kita
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || !url.startsWith(supabaseUrl)) {
      return new NextResponse('Invalid URL', { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/pdf',
        'Content-Disposition': 'inline', 
      },
    });
  } catch (error) {

    return new NextResponse('Error fetching document', { status: 500 });
  }
}
