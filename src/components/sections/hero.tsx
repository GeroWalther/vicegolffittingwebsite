import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { BUSINESS } from "@/lib/constants";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--volt)_0%,_transparent_60%)] opacity-60"
      />

      <div className="container-page relative pt-16 pb-16 lg:pt-24 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">{t("eyebrow")}</p>
            <h1 className="display text-[clamp(3rem,8vw,7rem)] max-w-3xl">
              {t("title")}
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <LinkButton
                href="/book"
                size="lg"
                className="h-12 px-6 text-sm uppercase tracking-wider"
              >
                {t("cta")}
                <ArrowUpRight className="ml-1 size-4" />
              </LinkButton>
              <a
                href="#demo-days"
                className="inline-flex items-center justify-center h-12 px-6 text-sm uppercase tracking-wider rounded-md border border-border bg-background hover:bg-muted transition font-medium"
              >
                {t("secondary")}
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl border-t border-border pt-8">
              <Stat label="Per session" value={`€${BUSINESS.fittingPriceEUR}`} />
              <Stat
                label="Duration"
                value={`${BUSINESS.fittingDurationMinutes} min`}
              />
              <Stat label="Location" value="Son Gual" />
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[300px] sm:h-[440px] lg:h-[620px] -mx-6 sm:mx-0">
            <Image
              src="/images/driver.webp"
              alt="Vice Golf VGD01 driver"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain object-center lg:object-right lg:scale-125"
            />
          </div>
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
