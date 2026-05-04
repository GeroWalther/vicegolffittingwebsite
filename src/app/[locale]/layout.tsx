import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { routing } from "@/i18n/routing";
import { BUSINESS } from "@/lib/constants";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${BUSINESS.shortName} — Official Vice Golf Fitter, Mallorca`,
    template: `%s · ${BUSINESS.shortName}`,
  },
  description:
    "Personal Vice Golf club fittings at Son Gual, Mallorca. Launch monitor, full bag analysis, and the complete Vice line — fit and built for your swing.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <WhatsAppButton />
          <Toaster theme="dark" position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
