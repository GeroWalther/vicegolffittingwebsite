export const BUSINESS = {
  name: "Vice Fitting Mallorca",
  shortName: "Vice Fitting",
  tagline: {
    en: "Official Vice Golf Fitter — Mallorca",
    de: "Offizieller Vice Golf Fitter — Mallorca",
    es: "Fitter Oficial de Vice Golf — Mallorca",
  },
  fitter: "Gero Walther",
  location: "Mallorca",
  whatsappNumber: "+34637920961",
  whatsappDisplay: "+34 637 920 961",
  email: "hello@vicegolf-mallorca.com",
  fittingPriceCents: 100,
  fittingPriceEUR: 1,
  fittingDurationMinutes: 60,
  currency: "eur",
} as const;

export const LOCALES = ["en", "de", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const FITTING_TIMEZONE = "Europe/Madrid";

export const DAILY_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:2020";

// Approximate coordinates for Palma de Mallorca (city centre).
export const VENUE_GEO = { lat: 39.5696, lng: 2.6502 };
export const VENUE_ADDRESS = {
  postalCode: "07001",
  addressLocality: "Palma",
  addressRegion: "Mallorca",
  addressCountry: "ES",
};

export const SEO_KEYWORDS = [
  "Vice Golf",
  "Vice Golf Mallorca",
  "Golf fitting Mallorca",
  "Club fitting Mallorca",
  "Vice fitter Mallorca",
  "Vice Golf Palma",
  "Vice Golf retailer Mallorca",
  "Golf Schläger Fitting Mallorca",
  "Fitting de palos Mallorca",
];
