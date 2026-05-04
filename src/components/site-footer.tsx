import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BUSINESS } from "@/lib/constants";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="container-page py-14 grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="block size-2.5 rounded-full bg-volt" />
            <span className="font-mono text-xs uppercase tracking-[0.22em]">
              Vice<span className="text-volt">/</span>Fitting
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
            <li><Link href="/fitting" className="hover:text-volt">{tNav("fitting")}</Link></li>
            <li><Link href="/demo-days" className="hover:text-volt">{tNav("demoDays")}</Link></li>
            <li><Link href="/products" className="hover:text-volt">{tNav("products")}</Link></li>
            <li><Link href="/book" className="hover:text-volt">{tNav("book")}</Link></li>
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
                className="hover:text-volt"
              >
                WhatsApp {BUSINESS.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-volt">
                {BUSINESS.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} {BUSINESS.name}. {t("rights")}</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-volt">{t("imprint")}</Link>
            <Link href="/" className="hover:text-volt">{t("privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
