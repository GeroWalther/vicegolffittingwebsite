import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { PressSection } from "@/components/sections/press-section";
import { FittingSection } from "@/components/sections/fitting-section";
import { ProductCategories } from "@/components/sections/product-categories";
import { DemoDaysSection, type DemoDayPreview } from "@/components/sections/demo-days-section";
import { AboutSection } from "@/components/sections/about-section";
import { CtaSection } from "@/components/sections/cta-section";
import { connectDB } from "@/lib/db";
import { DemoDay } from "@/lib/models/demoday";

export const dynamic = "force-dynamic";

async function getUpcomingDemoDays(): Promise<DemoDayPreview[]> {
  try {
    await connectDB();
    const items = await DemoDay.find({
      published: true,
      startsAt: { $gte: new Date() },
    })
      .sort({ startsAt: 1 })
      .limit(3)
      .lean();
    return items.map((d) => ({
      id: String(d._id),
      title: d.title,
      venue: d.venue,
      startsAt: d.startsAt.toISOString(),
      endsAt: d.endsAt.toISOString(),
    }));
  } catch (e) {
    console.warn("[home] Failed to load demo days:", (e as Error).message);
    return [];
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const demoDays = await getUpcomingDemoDays();

  return (
    <>
      <Hero />
      <MarqueeBand />
      <PressSection />
      <FittingSection />
      <ProductCategories />
      <DemoDaysSection demoDays={demoDays} />
      <AboutSection />
      <CtaSection />
    </>
  );
}
