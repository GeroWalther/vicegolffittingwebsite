export const BUSINESS = {
  name: "Vice Fitting Mallorca",
  shortName: "Vice Fitting",
  tagline: {
    en: "Official Vice Golf Fitter — Mallorca",
    de: "Offizieller Vice Golf Fitter — Mallorca",
    es: "Fitter Oficial de Vice Golf — Mallorca",
  },
  fitter: "Gero Walther",
  location: "Son Gual Golf, Mallorca",
  whatsappNumber: "+34637920961",
  whatsappDisplay: "+34 637 920 961",
  email: "hello@vicegolf-mallorca.com",
  fittingPriceCents: 9000,
  fittingPriceEUR: 90,
  fittingDurationMinutes: 60,
  currency: "eur",
} as const;

export const LOCALES = ["en", "de", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const FITTING_TIMEZONE = "Europe/Madrid";

export const DAILY_SLOTS = [
  "09:00",
  "10:30",
  "12:00",
  "14:00",
  "15:30",
  "17:00",
] as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:2020";

// Approximate coordinates for Son Gual Golf, Mallorca
export const VENUE_GEO = { lat: 39.5894, lng: 2.7567 };
export const VENUE_ADDRESS = {
  streetAddress: "Crta. Vieja Palma–Manacor, Km 11.5",
  postalCode: "07199",
  addressLocality: "Palma",
  addressRegion: "Mallorca",
  addressCountry: "ES",
};

export const SEO_KEYWORDS = [
  "Vice Golf",
  "Vice Golf Mallorca",
  "Golf fitting Mallorca",
  "Club fitting Mallorca",
  "Son Gual fitting",
  "Vice fitter",
  "Vice Golf retailer Mallorca",
  "Golf Schläger Fitting Mallorca",
  "Fitting de palos Mallorca",
];
