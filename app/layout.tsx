import type { Metadata } from "next";
import { Source_Serif_4, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBotDesa from "./components/ChatBotDesa";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Website Resmi Desa Kedungdowo",
    template: "%s | Desa Kedungdowo",
  },
  description:
    "Portal informasi resmi, layanan publik, berita, dan potensi UMKM Desa Kedungdowo, Kecamatan Andong, Kabupaten Boyolali.",
  keywords: "Desa Kedungdowo, Andong, Boyolali, Web Desa, Pemdes",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: "Website Resmi Desa Kedungdowo",
    description:
      "Portal informasi resmi, layanan publik, berita, dan potensi UMKM Desa Kedungdowo, Kecamatan Andong, Kabupaten Boyolali.",
    siteName: "Desa Kedungdowo",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Desa Kedungdowo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Resmi Desa Kedungdowo",
    description:
      "Portal informasi resmi, layanan publik, berita, dan potensi UMKM Desa Kedungdowo, Kecamatan Andong, Kabupaten Boyolali.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "Pemerintah Desa Kedungdowo",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kantor Kepala Desa Kedungdowo",
      addressLocality: "Kecamatan Andong",
      addressRegion: "Kabupaten Boyolali",
      addressCountry: "ID",
    },
  };

  return (
    <html
      lang="id"
      className={`${sourceSerif.variable} ${plusJakarta.variable} h-full antialiased overflow-x-hidden w-full`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden w-full relative">
        <Navbar />
        <main className="flex-grow w-full overflow-hidden">{children}</main>
        <Footer />
        <ChatBotDesa />
      </body>
    </html>
  );
}
