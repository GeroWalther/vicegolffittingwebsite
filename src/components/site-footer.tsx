import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BUSINESS } from "@/lib/constants";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const home = `/${locale}`;

  return (
    <footer className="border-t border-border mt-24">
      <div className="container-page py-14 grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="block size-3 rounded-full bg-volt" />
            <span className="font-heading text-sm font-extrabold uppercase tracking-tight">
              Vice Fitting
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">{t("tagline")}</p>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            {BUSINESS.location}
          </p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Site</p>
          <ul className="space-y-2 text-sm">
            <li><a href={`${home}#fitting`} className="hover:underline">{tNav("fitting")}</a></li>
            <li><a href={`${home}#products`} className="hover:underline">{tNav("products")}</a></li>
            <li><a href={`${home}#demo-days`} className="hover:underline">{tNav("demoDays")}</a></li>
            <li><Link href="/book" className="hover:underline">{tNav("book")}</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`https://wa.me/${BUSINESS.whatsappNumber.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                WhatsApp {BUSINESS.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${BUSINESS.email}`} className="hover:underline">
                {BUSINESS.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} {BUSINESS.name}. {t("rights")}</p>
          <div className="flex gap-4">
            <span className="opacity-60">{t("imprint")}</span>
            <span className="opacity-60">{t("privacy")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
