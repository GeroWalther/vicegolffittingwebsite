import { setRequestLocale, getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { connectDB } from "@/lib/db";
import { DemoDay } from "@/lib/models/demoday";
import { CtaSection } from "@/components/sections/cta-section";

export const dynamic = "force-dynamic";

async function getAllDemoDays() {
  try {
    await connectDB();
    const items = await DemoDay.find({
      published: true,
      startsAt: { $gte: new Date() },
    })
      .sort({ startsAt: 1 })
      .lean();
    return items.map((d) => ({
      id: String(d._id),
      title: d.title,
      venue: d.venue,
      address: d.address ?? "",
      description: d.description ?? "",
      startsAt: d.startsAt,
      endsAt: d.endsAt,
    }));
  } catch (e) {
    console.warn("[demo-days] Failed to load:", (e as Error).message);
    return [];
  }
}

export default async function DemoDaysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("demoSection");
  const demoDays = await getAllDemoDays();

  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <section className="container-page pt-20 lg:pt-32 pb-12">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>
        <h1 className="display text-5xl sm:text-7xl max-w-4xl">{t("title")}</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{t("body")}</p>
      </section>

      <section className="container-page pb-20">
        {demoDays.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {demoDays.map((d) => (
              <article
                key={d.id}
                className="group rounded-md border border-border bg-card p-8 hover:border-volt/60 transition-colors"
              >
                <p className="inline-block bg-volt text-volt-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]">
                  {dateFmt.format(d.startsAt)}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  {d.title}
                </h3>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {d.venue}
                  {d.address ? ` · ${d.address}` : ""}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {timeFmt.format(d.startsAt)} — {timeFmt.format(d.endsAt)}
                </p>
                {d.description && (
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {d.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <CtaSection />
    </>
  );
}
