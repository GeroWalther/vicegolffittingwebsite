type FaqItem = { q: string; a: string };

/**
 * Emits FAQPage structured data so Google can show the questions as
 * rich results under the page. Keep the q/a text identical to what is
 * rendered on the page (Google requires the visible content to match).
 */
export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
