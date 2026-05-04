"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES } from "@/lib/constants";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  de: "DE",
  es: "ES",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onSelect(next: (typeof LOCALES)[number]) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error - dynamic path params are passed through
        { pathname, params },
        { locale: next },
      );
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
            onSelect={() => onSelect(l)}
            className="font-mono text-xs uppercase tracking-wider"
          >
            {LOCALE_LABELS[l]}
            {l === locale && <span className="ml-auto text-volt">●</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
