import {
  BUSINESS,
  SITE_URL,
  VENUE_ADDRESS,
  VENUE_GEO,
} from "@/lib/constants";

export function LocalBusinessJsonLd({ locale }: { locale: string }) {
  const url = `${SITE_URL}/${locale}`;

  // GolfClub is a recognised schema.org type; pairs well with SportsActivityLocation.
  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation", "Store"],
    "@id": `${SITE_URL}#business`,
    name: BUSINESS.name,
    alternateName: BUSINESS.shortName,
    url,
    logo: `${SITE_URL}/opengraph-image`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      "Official Vice Golf retailer and fitter on Mallorca. Personal club fittings by appointment across the island.",
    telephone: BUSINESS.whatsappNumber,
    email: BUSINESS.email,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Credit Card",
    address: {
      "@type": "PostalAddress",
      ...VENUE_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: VENUE_GEO.lat,
      longitude: VENUE_GEO.lng,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Mallorca" },
      { "@type": "AdministrativeArea", name: "Balearic Islands" },
    ],
    sameAs: [
      // Add real social links here when you have them:
      // "https://www.instagram.com/vicegolfmallorca",
      // "https://www.facebook.com/vicegolfmallorca",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BUSINESS.whatsappNumber,
        contactType: "customer service",
        availableLanguage: ["English", "German", "Spanish"],
        areaServed: "ES",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    makesOffer: {
      "@type": "Offer",
      name: "Vice Golf Private Club Fitting",
      description:
        "60-minute personal club fitting with launch monitor in Mallorca. Fee credited back against any Vice Golf order.",
      price: BUSINESS.fittingPriceEUR,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/${locale}/book`,
      itemOffered: {
        "@type": "Service",
        name: "Vice Golf Club Fitting",
        provider: { "@id": `${SITE_URL}#business` },
        serviceType: "Golf club fitting",
        areaServed: "Mallorca",
      },
    },
    brand: {
      "@type": "Brand",
      name: "Vice Golf",
    },
  } as const;

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
