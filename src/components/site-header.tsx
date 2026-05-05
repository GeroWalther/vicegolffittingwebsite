"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { LocaleSwitcher } from "./locale-switcher";

const SECTION_LINKS = [
  { hash: "fitting", key: "fitting" as const },
  { hash: "products", key: "products" as const },
  { hash: "demo-days", key: "demoDays" as const },
  { hash: "about", key: "about" as const },
  { hash: "contact", key: "contact" as const },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const onHome = pathname === `/${locale}` || pathname === "/";
  const [open, setOpen] = useState(false);

  // On home page → in-page anchor (browser scrolls smoothly).
  // Off home → full URL so we navigate back to the localized home, then jump to the anchor.
  const sectionHref = (hash: string) =>
    onHome ? `#${hash}` : `/${locale}#${hash}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="block size-3 rounded-full bg-volt transition group-hover:scale-110" />
          <span className="font-heading text-sm font-extrabold uppercase tracking-tight">
            Vice Fitting
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.hash}
              href={sectionHref(link.hash)}
              className="px-3 py-2 text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <LinkButton href="/book" size="sm" className="hidden sm:inline-flex">
            {t("book")}
          </LinkButton>
          <button
            type="button"
            aria-label={t("menu")}
            className="lg:hidden inline-flex size-9 items-center justify-center rounded-md border border-border"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-background">
          <div className="container-page flex flex-col py-4 gap-1">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.hash}
                href={sectionHref(link.hash)}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-base font-medium uppercase tracking-wide hover:underline"
              >
                {t(link.key)}
              </a>
            ))}
            <LinkButton
              href="/book"
              size="lg"
              className="mt-2"
              onClick={() => setOpen(false)}
            >
              {t("book")}
            </LinkButton>
          </div>
        </nav>
      )}
    </header>
  );
}
