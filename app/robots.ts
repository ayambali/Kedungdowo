import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.desakedungdowo.com";
  if (!siteUrl.startsWith("http")) siteUrl = `https://${siteUrl}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `https://desakedungdowo.com/sitemap.xml`,
  };
}
