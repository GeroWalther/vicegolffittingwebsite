"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { LocaleSwitcher } from "./locale-switcher";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/" as const, key: "home" },
  { href: "/fitting" as const, key: "fitting" },
  { href: "/demo-days" as const, key: "demoDays" },
  { href: "/products" as const, key: "products" },
  { href: "/about" as const, key: "about" },
  { href: "/contact" as const, key: "contact" },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="block size-2.5 rounded-full bg-volt transition group-hover:scale-110" />
          <span className="font-mono text-xs uppercase tracking-[0.22em]">
            Vice<span className="text-volt">/</span>Fitting
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(link.key as keyof IntlMessages["nav"])}
              </Link>
            );
          })}
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-base font-medium uppercase tracking-wide hover:text-volt"
              >
                {t(link.key as keyof IntlMessages["nav"])}
              </Link>
            ))}
            <LinkButton href="/book" size="lg" className="mt-2" onClick={() => setOpen(false)}>
              {t("book")}
            </LinkButton>
          </div>
        </nav>
      )}
    </header>
  );
}

type IntlMessages = {
  nav: {
    home: string;
    fitting: string;
    demoDays: string;
    products: string;
    about: string;
    contact: string;
    book: string;
    menu: string;
  };
};
