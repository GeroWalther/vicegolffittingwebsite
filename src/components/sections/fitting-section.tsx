import { useTranslations } from "next-intl";
import { Check, ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { BUSINESS } from "@/lib/constants";

export function FittingSection() {
  const t = useTranslations("fittingSection");
  const includes = t.raw("includes") as string[];

  return (
    <section className="container-page py-24 lg:py-32">
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
          <div className="flex items-baseline gap-2">
            <span className="display text-7xl">€{BUSINESS.fittingPriceEUR}</span>
            <span className="text-muted-foreground font-mono text-sm">
              {t("priceUnit")}
            </span>
          </div>
          <ul className="mt-8 space-y-3 border-t border-border/60 pt-6">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-volt/15 text-volt">
                  <Check className="size-3" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <LinkButton href="/book" size="lg" className="mt-8 w-full h-12 uppercase tracking-wider text-sm">
            {t("cta")}
            <ArrowUpRight className="ml-1 size-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
