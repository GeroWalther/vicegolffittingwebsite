import { setRequestLocale, getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";

type Params = { params: Promise<{ locale: string }> };

export default async function SuccessPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("success");
  return (
    <section className="container-page pt-32 pb-32 text-center">
      <span className="inline-flex size-16 items-center justify-center rounded-full bg-volt/15 text-volt">
        <CheckCircle2 className="size-8" />
      </span>
      <h1 className="display text-5xl sm:text-6xl mt-8">{t("title")}</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">{t("body")}</p>
      <LinkButton href="/" size="lg" className="mt-10 uppercase tracking-wider">
        {t("cta")}
      </LinkButton>
    </section>
  );
}
