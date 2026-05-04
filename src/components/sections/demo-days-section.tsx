import { useTranslations, useLocale, useFormatter } from "next-intl";
import { ArrowUpRight, MapPin } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

export type DemoDayPreview = {
  id: string;
  title: string;
  venue: string;
  startsAt: string;
  endsAt: string;
};

export function DemoDaysSection({ demoDays }: { demoDays: DemoDayPreview[] }) {
  const t = useTranslations("demoSection");
  const format = useFormatter();
  const locale = useLocale();

  return (
    <section className="container-page py-24 border-t border-border/40">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <h2 className="display text-4xl sm:text-5xl max-w-2xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">{t("body")}</p>
        </div>
        <LinkButton href="/demo-days" variant="outline" size="lg" className="uppercase text-sm tracking-wider">
          {t("cta")} <ArrowUpRight className="ml-1 size-4" />
        </LinkButton>
      </div>

      {demoDays.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoDays.slice(0, 3).map((d) => {
            const date = new Date(d.startsAt);
            return (
              <article
                key={d.id}
                className="group rounded-md border border-border bg-card p-6 hover:border-volt/60 transition-colors"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-volt">
                  {format.dateTime(date, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{d.title}</h3>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {d.venue}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {format.dateTime(date, { hour: "2-digit", minute: "2-digit" })} —{" "}
                  {format.dateTime(new Date(d.endsAt), {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </article>
            );
          })}
        </div>
      )}
      {/* Suppress unused warning when locale isn't directly referenced */}
      <span className="sr-only">{locale}</span>
    </section>
  );
}
