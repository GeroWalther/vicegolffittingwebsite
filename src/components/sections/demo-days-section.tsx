"use client";

import { useState } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { MapPin, ArrowUpRight } from "lucide-react";
import { DemoDayRsvpDialog } from "@/components/demo-day-rsvp-dialog";

export type DemoDayPreview = {
  id: string;
  title: string;
  venue: string;
  startsAt: string;
  endsAt: string;
};

export function DemoDaysSection({ demoDays }: { demoDays: DemoDayPreview[] }) {
  const t = useTranslations("demoSection");
  const tRsvp = useTranslations("rsvp");
  const format = useFormatter();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="demo-days"
      className="container-page py-24 lg:py-32 scroll-mt-20 border-t border-border"
    >
      <p className="eyebrow mb-4">{t("eyebrow")}</p>
      <h2 className="display text-4xl sm:text-5xl lg:text-6xl max-w-3xl">
        {t("title")}
      </h2>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{t("body")}</p>

      <div className="mt-12">
        {demoDays.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoDays.map((d) => {
              const date = new Date(d.startsAt);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setOpenId(d.id)}
                  className="group text-left rounded-md border border-border bg-card p-6 hover:border-foreground/40 transition-colors"
                >
                  <p className="inline-block bg-volt text-volt-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]">
                    {format.dateTime(date, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">
                    {d.title}
                  </h3>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" /> {d.venue}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {format.dateTime(date, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    —{" "}
                    {format.dateTime(new Date(d.endsAt), {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-foreground group-hover:gap-2 transition-all">
                    {tRsvp("ctaShort")} <ArrowUpRight className="size-3.5" />
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <DemoDayRsvpDialog
        open={openId !== null}
        onOpenChange={(v) => !v && setOpenId(null)}
        demoDayId={openId}
      />
    </section>
  );
}
