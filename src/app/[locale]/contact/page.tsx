import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactSection");

  const number = BUSINESS.whatsappNumber.replace("+", "");

  return (
    <section className="container-page pt-20 lg:pt-32 pb-32">
      <p className="eyebrow mb-4">{t("eyebrow")}</p>
      <h1 className="display text-5xl sm:text-7xl max-w-4xl">{t("title")}</h1>

      <div className="mt-16 grid lg:grid-cols-2 gap-4">
        <a
          href={`https://wa.me/${number}`}
          target="_blank"
          rel="noreferrer"
          className="group rounded-md border border-border bg-card p-8 hover:border-volt/60 transition"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-md bg-volt text-volt-foreground">
              <MessageCircle className="size-5" />
            </span>
            <div>
              <p className="eyebrow">{t("whatsappNote")}</p>
              <p className="text-xl font-semibold">{t("whatsapp")}</p>
            </div>
          </div>
          <p className="mt-6 font-mono text-2xl tracking-tight group-hover:text-volt transition">
            {BUSINESS.whatsappDisplay}
          </p>
        </a>

        <a
          href={`mailto:${BUSINESS.email}`}
          className="group rounded-md border border-border bg-card p-8 hover:border-volt/60 transition"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-md bg-secondary border border-border">
              <Mail className="size-5" />
            </span>
            <div>
              <p className="eyebrow">{t("emailNote")}</p>
              <p className="text-xl font-semibold">{t("email")}</p>
            </div>
          </div>
          <p className="mt-6 font-mono text-lg tracking-tight group-hover:text-volt transition break-all">
            {BUSINESS.email}
          </p>
        </a>
      </div>

      <div className="mt-12 rounded-md border border-border bg-card p-8">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-md bg-secondary border border-border">
            <MapPin className="size-5" />
          </span>
          <div>
            <p className="eyebrow">Fitting location</p>
            <p className="mt-1 text-xl font-semibold">{BUSINESS.location}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              All private fittings are held at Son Gual. Public demo days move
              around — check the demo days page for upcoming dates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
