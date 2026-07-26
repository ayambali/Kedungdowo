import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.desakedungdowo.com";
if (!siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) return {};

  const artikel = await prisma.artikel.findUnique({
    where: { id },
  });

  if (!artikel) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  // Strip HTML tags and get first 150 characters
  const plainTextKonten = artikel.konten.replace(/<[^>]+>/g, "");
  const description =
    plainTextKonten.substring(0, 150) +
    (plainTextKonten.length > 150 ? "..." : "");

  const imageUrl = artikel.fotoUrl || `${siteUrl}/og-image.jpg`;

  return {
    title: artikel.judul,
    description: description,
    openGraph: {
      title: artikel.judul,
      description: description,
      type: "article",
      url: `${siteUrl}/artikel/${id}`,
      images: [
        {
          url: imageUrl,
          alt: artikel.judul,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: artikel.judul,
      description: description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/artikel/${id}`,
    },
  };
}

export default async function ArtikelDetail({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) notFound();

  const artikel = await prisma.artikel.findUnique({
    where: { id },
  });

  if (!artikel) {
    notFound();
  }

  const imageUrl = artikel.fotoUrl || "/og-image.jpg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: artikel.judul,
    image: [imageUrl],
    datePublished: artikel.createdAt.toISOString(),
    author: [
      {
        "@type": "Organization",
        name: "Pemdes Kedungdowo",
        url: siteUrl,
      },
    ],
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold font-serif mb-4">{artikel.judul}</h1>
        <div className="text-gray-500 mb-6">
          {new Date(artikel.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={artikel.judul}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: artikel.konten }}
      />
    </article>
  );
}
