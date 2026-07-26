import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.desakedungdowo.com";
  if (!siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;

  // Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/umkm`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic Routes for Artikel
  const artikels = await prisma.artikel.findMany({
    select: {
      id: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const artikelRoutes: MetadataRoute.Sitemap = artikels.map((artikel) => ({
    url: `${siteUrl}/artikel/${artikel.id}`,
    lastModified: artikel.createdAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...artikelRoutes];
}
