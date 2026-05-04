import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

export function CtaSection() {
  const t = useTranslations("hero");
  return (
    <section className="container-page py-24">
      <div className="relative overflow-hidden rounded-md border border-border bg-card p-10 sm:p-16 lg:p-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--volt)_0%,_transparent_55%)] opacity-20"
        />
        <div className="relative max-w-3xl">
          <h2 className="display text-4xl sm:text-6xl">{t("title")}</h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            {t("subtitle")}
          </p>
          <LinkButton href="/book" size="lg" className="mt-8 h-12 px-6 uppercase tracking-wider text-sm">
            {t("cta")}
            <ArrowUpRight className="ml-1 size-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
