"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, type Locale } from "@/lib/constants";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  es: "ES",
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onSelect(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 font-mono text-xs uppercase tracking-wider hover:bg-muted disabled:opacity-50"
        disabled={isPending}
      >
        <Globe className="size-3.5" />
        {LOCALE_LABELS[locale]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[8rem]">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => onSelect(l)}
            className="font-mono text-xs uppercase tracking-wider cursor-pointer"
          >
            {LOCALE_LABELS[l]}
            {l === locale && (
              <span className="ml-auto inline-block size-2 rounded-full bg-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
