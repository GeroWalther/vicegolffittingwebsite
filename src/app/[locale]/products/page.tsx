import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { CATEGORIES } from "@/lib/categories";

type Params = { params: Promise<{ locale: string }> };

export default async function ProductsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("productsSection");

  return (
    <>
      <section className="container-page pt-20 lg:pt-32 pb-12">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>
        <h1 className="display text-5xl sm:text-7xl max-w-4xl">{t("title")}</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{t("body")}</p>
      </section>

      <section className="container-page pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((c) => (
            <article
              key={c.code}
              className="group rounded-md border border-border bg-card overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 to-foreground/70 flex items-center justify-center">
                    <span className="font-heading text-4xl font-extrabold uppercase tracking-tight text-white opacity-90">
                      {c.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  VFT-{c.code}
                </span>
                <h3 className="mt-2 font-heading text-2xl font-extrabold uppercase tracking-tight">
                  {c.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-md border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground max-w-xl mx-auto">
            Online ordering coming soon. For now, message me for stock and
            pricing — I&apos;ll arrange your kit through Vice direct.
          </p>
          <LinkButton
            href="/contact"
            size="lg"
            className="mt-6 uppercase tracking-wider"
          >
            Get in touch <ArrowUpRight className="ml-1 size-4" />
          </LinkButton>
        </div>
      </section>
    </>
  );
}
