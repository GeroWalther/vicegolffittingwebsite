import { useTranslations } from "next-intl";
import { BUSINESS } from "@/lib/constants";

export function AboutSection() {
  const t = useTranslations("aboutSection");
  return (
    <section className="container-page py-24 lg:py-32 border-t border-border/40">
      <div className="grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <h2 className="display text-4xl sm:text-5xl">{t("title")}</h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("body")}
          </p>
          <div className="mt-8 flex items-center gap-4 border-t border-border/40 pt-6">
            <div className="size-12 rounded-full bg-volt/20 border border-volt/40 flex items-center justify-center font-bold text-volt">
              GW
            </div>
            <div>
              <p className="font-semibold">{BUSINESS.fitter}</p>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Certified Vice Fitter · Mallorca
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
