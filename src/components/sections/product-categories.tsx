import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { CATEGORIES } from "@/lib/categories";

export function ProductCategories() {
  const t = useTranslations("productsSection");

  return (
    <section className="container-page py-24 border-t border-border">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <h2 className="display text-4xl sm:text-5xl max-w-2xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">{t("body")}</p>
        </div>
        <LinkButton
          href="/products"
          variant="outline"
          size="lg"
          className="uppercase text-sm tracking-wider"
        >
          {t("cta")}
          <ArrowUpRight className="ml-1 size-4" />
        </LinkButton>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.code}
            href="/products"
            className="group relative aspect-[4/5] overflow-hidden rounded-md bg-card border border-border"
          >
            {c.image ? (
              <>
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 to-foreground/70" />
            )}

            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              <span className="self-start font-mono text-[10px] uppercase tracking-[0.18em] text-white bg-black/40 backdrop-blur px-2 py-0.5 rounded">
                VFT-{c.code}
              </span>
              <div className="flex items-end justify-between gap-2">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white leading-none">
                  {c.name}
                </span>
                <ArrowUpRight className="size-5 text-white shrink-0 opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
