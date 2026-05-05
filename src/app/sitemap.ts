import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const langs: Record<string, string> = {};
    for (const l of routing.locales) langs[l] = `${SITE_URL}/${l}`;

    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: locale === routing.defaultLocale ? 1 : 0.9,
      alternates: { languages: langs },
    });

    entries.push({
      url: `${SITE_URL}/${locale}/book`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
