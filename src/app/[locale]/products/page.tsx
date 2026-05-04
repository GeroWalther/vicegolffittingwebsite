import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

type Params = { params: Promise<{ locale: string }> };

const CATEGORIES = [
  { name: "Drivers", code: "VFT-01" },
  { name: "Fairway Woods", code: "VFT-02" },
  { name: "Hybrids", code: "VFT-03" },
  { name: "Irons", code: "VFT-04" },
  { name: "Wedges", code: "VFT-05" },
  { name: "Putters", code: "VFT-06" },
  { name: "Balls", code: "VFT-07" },
  { name: "Apparel", code: "VFT-08" },
];

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <div
              key={c.code}
              className="group aspect-square rounded-md border border-border bg-card flex flex-col justify-between p-5 hover:border-volt/60 transition"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {c.code}
              </span>
              <span className="font-bold text-xl uppercase tracking-tight group-hover:text-volt transition">
                {c.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-md border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground max-w-xl mx-auto">
            Online ordering coming soon. For now, message me for stock and
            pricing — I&apos;ll arrange your kit through Vice direct.
          </p>
          <LinkButton href="/contact" size="lg" className="mt-6 uppercase tracking-wider">
            Get in touch <ArrowUpRight className="ml-1 size-4" />
          </LinkButton>
        </div>
      </section>
    </>
  );
}
