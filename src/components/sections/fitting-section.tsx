import { useTranslations } from "next-intl";
import { Check, ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { BUSINESS } from "@/lib/constants";

export function FittingSection() {
  const t = useTranslations("fittingSection");
  const includes = t.raw("includes") as string[];

  return (
    <section id="fitting" className="container-page py-24 lg:py-32 scroll-mt-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div>
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <h2 className="display text-4xl sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
            {t("body")}
          </p>
        </div>

        <div className="relative rounded-md border border-border bg-card p-8 lg:p-10">
          <div className="absolute -top-3 left-8 bg-volt px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-volt-foreground">
            {t("priceLabel")}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-2xl font-medium tracking-tight">
              {BUSINESS.fittingPriceEUR} €
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              {t("priceUnit")}
            </span>
          </div>
          <ul className="mt-8 space-y-3 border-t border-border/60 pt-6">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-volt text-volt-foreground">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-md bg-volt p-4">
            <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-volt-foreground">
              {t("creditTitle")}
            </p>
            <p className="mt-1 text-xs text-volt-foreground/85 leading-relaxed">
              {t("creditBody")}
            </p>
          </div>

          <LinkButton href="/book" size="lg" className="mt-6 w-full h-12 uppercase tracking-wider text-sm">
            {t("cta")}
            <ArrowUpRight className="ml-1 size-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
