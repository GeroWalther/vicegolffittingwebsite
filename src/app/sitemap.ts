import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const homeLangs: Record<string, string> = {};
    const bookLangs: Record<string, string> = {};
    for (const l of routing.locales) {
      homeLangs[l] = `${SITE_URL}/${l}`;
      bookLangs[l] = `${SITE_URL}/${l}/book`;
    }

    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: locale === routing.defaultLocale ? 1 : 0.9,
      alternates: { languages: homeLangs },
    });

    entries.push({
      url: `${SITE_URL}/${locale}/book`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: bookLangs },
    });
  }

  return entries;
}
