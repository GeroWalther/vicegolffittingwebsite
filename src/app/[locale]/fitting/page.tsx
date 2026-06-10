import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, ArrowUpRight, MapPin, Gauge } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { routing } from "@/i18n/routing";
import { BUSINESS, SITE_URL } from "@/lib/constants";

type Props = { params: Promise<{ locale: string }> };

type ProcessStep = { step: string; title: string; body: string };
type FaqItem = { q: string; a: string };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "fittingPage" });
  const url = `${SITE_URL}/${locale}/fitting`;

  // Per-page hreflang so Google serves the right language for /fitting.
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/fitting`;
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/fitting`;

  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    // absolute → skip the site-wide "%s · Vice Fitting Mallorca" template,
    // this page owns its full title for the target keyword.
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Vice Fitting Mallorca",
      locale: locale === "en" ? "en_US" : locale === "de" ? "de_DE" : "es_ES",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function FittingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("fittingPage");

  const includes = t.raw("includes") as string[];
  const process = t.raw("process") as ProcessStep[];
  const faq = t.raw("faq") as FaqItem[];

  return (
    <>
      {/* Hero */}
      <section className="container-page pt-20 lg:pt-28 pb-16 lg:pb-20">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>
        <h1 className="display text-4xl sm:text-5xl lg:text-6xl max-w-3xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {t("intro")}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <LinkButton
            href="/book"
            size="lg"
            className="h-12 px-6 uppercase tracking-wider text-sm"
          >
            {t("ctaBook")}
            <ArrowUpRight className="ml-1 size-4" />
          </LinkButton>
          <a
            href={`https://wa.me/${BUSINESS.whatsappNumber.replace("+", "")}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("ctaWhatsapp")}
          </a>
        </div>
      </section>

      {/* What's included */}
      <section className="container-page py-16 lg:py-20 border-t border-border">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <h2 className="display text-3xl sm:text-4xl">
              {t("includesTitle")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
              {t("includesBody")}
            </p>
          </div>
          <ul className="space-y-4">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base">
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-volt text-volt-foreground">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="container-page py-16 lg:py-20 border-t border-border">
        <h2 className="display text-3xl sm:text-4xl">{t("processTitle")}</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((s) => (
            <div key={s.step}>
              <span className="font-mono text-xs text-volt-foreground bg-volt px-2 py-0.5 uppercase tracking-[0.18em]">
                {s.step}
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Location + tech */}
      <section className="container-page py-16 lg:py-20 border-t border-border">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-md border border-border bg-card p-8">
            <MapPin className="size-6 text-volt-foreground" />
            <h3 className="mt-4 font-heading text-xl font-bold">
              {t("locationTitle")}
            </h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("locationBody")}
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-8">
            <Gauge className="size-6 text-volt-foreground" />
            <h3 className="mt-4 font-heading text-xl font-bold">
              {t("techTitle")}
            </h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t("techBody")}
            </p>
          </div>
        </div>
      </section>

      {/* Credit-back highlight */}
      <section className="container-page py-16 lg:py-20 border-t border-border">
        <div className="rounded-md bg-volt p-8 lg:p-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-volt-foreground max-w-2xl">
            {t("creditTitle")}
          </h2>
          <p className="mt-3 text-volt-foreground/85 leading-relaxed max-w-2xl">
            {t("creditBody")}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-16 lg:py-24 border-t border-border">
        <h2 className="display text-3xl sm:text-4xl">{t("faqTitle")}</h2>
        <div className="mt-10 max-w-3xl divide-y divide-border border-t border-border">
          {faq.map((item) => (
            <div key={item.q} className="py-6">
              <h3 className="font-heading text-lg font-bold">{item.q}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <LinkButton
            href="/book"
            size="lg"
            className="h-12 px-6 uppercase tracking-wider text-sm"
          >
            {t("ctaBook")}
            <ArrowUpRight className="ml-1 size-4" />
          </LinkButton>
        </div>
      </section>

      <FaqJsonLd items={faq} />
    </>
  );
}
