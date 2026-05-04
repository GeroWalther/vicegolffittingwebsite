import { setRequestLocale } from "next-intl/server";
import { FittingSection } from "@/components/sections/fitting-section";
import { CtaSection } from "@/components/sections/cta-section";
import { useTranslations } from "next-intl";

export default async function FittingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FittingPageBody />;
}

function FittingPageBody() {
  const t = useTranslations("fittingSection");
  return (
    <>
      <section className="container-page pt-20 lg:pt-32 pb-8">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>
        <h1 className="display text-5xl sm:text-7xl max-w-4xl">{t("title")}</h1>
      </section>
      <FittingSection />
      <CtaSection />
    </>
  );
}
