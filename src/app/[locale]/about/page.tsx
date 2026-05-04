import { setRequestLocale } from "next-intl/server";
import { AboutSection } from "@/components/sections/about-section";
import { CtaSection } from "@/components/sections/cta-section";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <AboutSection />
      <CtaSection />
    </>
  );
}
