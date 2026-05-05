import { useTranslations } from "next-intl";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export function ContactSection() {
  const t = useTranslations("contactSection");
  const number = BUSINESS.whatsappNumber.replace("+", "");

  return (
    <section id="contact" className="container-page py-24 lg:py-32 scroll-mt-20 border-t border-border">
      <p className="eyebrow mb-4">{t("eyebrow")}</p>
      <h2 className="display text-4xl sm:text-5xl lg:text-6xl max-w-4xl">
        {t("title")}
      </h2>

      <div className="mt-12 grid lg:grid-cols-2 gap-3">
        <a
          href={`https://wa.me/${number}`}
          target="_blank"
          rel="noreferrer"
          className="group rounded-md border border-border bg-card p-8 hover:border-foreground/40 transition"
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
          <p className="mt-6 font-mono text-2xl tracking-tight group-hover:underline">
            {BUSINESS.whatsappDisplay}
          </p>
        </a>

        <a
          href={`mailto:${BUSINESS.email}`}
          className="group rounded-md border border-border bg-card p-8 hover:border-foreground/40 transition"
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
          <p className="mt-6 font-mono text-lg tracking-tight group-hover:underline break-all">
            {BUSINESS.email}
          </p>
        </a>
      </div>

      <div className="mt-3 rounded-md border border-border bg-card p-8">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-md bg-secondary border border-border">
            <MapPin className="size-5" />
          </span>
          <div>
            <p className="eyebrow">Fitting location</p>
            <p className="mt-1 text-xl font-semibold">{BUSINESS.location}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              All private fittings are held at Son Gual. Public demo days move
              around — see the demo days section above for upcoming dates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
