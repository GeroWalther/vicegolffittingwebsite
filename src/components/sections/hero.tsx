import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { BUSINESS } from "@/lib/constants";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--volt)_0%,_transparent_45%)] opacity-25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_85%)]"
      />

      <div className="container-page relative pt-20 pb-24 lg:pt-32 lg:pb-36">
        <p className="eyebrow mb-6">{t("eyebrow")}</p>
        <h1 className="display text-[clamp(3rem,9vw,8rem)] max-w-5xl">
          {t("title")}
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
          {t("subtitle")}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/book" size="lg" className="h-12 px-6 text-sm uppercase tracking-wider">
            {t("cta")}
            <ArrowUpRight className="ml-1 size-4" />
          </LinkButton>
          <LinkButton href="/demo-days" size="lg" variant="outline" className="h-12 px-6 text-sm uppercase tracking-wider">
            {t("secondary")}
          </LinkButton>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl border-t border-border/40 pt-8">
          <Stat label="Per session" value={`€${BUSINESS.fittingPriceEUR}`} />
          <Stat label="Duration" value={`${BUSINESS.fittingDurationMinutes} min`} />
          <Stat label="Location" value="Son Gual" />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-bold text-2xl tracking-tight">{value}</p>
    </div>
  );
}
