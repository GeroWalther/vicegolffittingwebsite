import type { Metadata } from "next";
import { Inter, Poppins, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-json-ld";
import { routing } from "@/i18n/routing";
import { SEO_KEYWORDS, SITE_URL } from "@/lib/constants";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("title");
  const description = t("description");
  const ogAlt = t("ogAlt");
  const url = `${SITE_URL}/${locale}`;

  // Build hreflang alternates so Google knows which language to serve.
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}`;
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: t("titleTemplate"),
    },
    description,
    keywords: SEO_KEYWORDS,
    applicationName: "Vice Fitting Mallorca",
    authors: [{ name: "Gero Walther" }],
    creator: "Gero Walther",
    publisher: "Vice Fitting Mallorca",
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Vice Fitting Mallorca",
      locale: locale === "en" ? "en_US" : locale === "de" ? "de_DE" : "es_ES",
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => (l === "en" ? "en_US" : l === "de" ? "de_DE" : "es_ES")),
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <WhatsAppButton />
          <Toaster theme="light" position="top-center" />
        </NextIntlClientProvider>
        <LocalBusinessJsonLd locale={locale} />
        <Analytics />
      </body>
    </html>
  );
}
