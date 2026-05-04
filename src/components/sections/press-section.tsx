import Image from "next/image";
import { useTranslations } from "next-intl";

const PRESS = [
  { src: "/images/vice-golf-as-seen-on-banner-GOLF.avif", alt: "GOLF" },
  { src: "/images/As-seen-on-golf-Digest-big.webp", alt: "Golf Digest" },
  { src: "/images/vice-golf-as-seen-on-banner-Golf_Channel.avif", alt: "Golf Channel" },
  { src: "/images/vice-golf-as-seen-on-banner-MyGolfSpy.avif", alt: "MyGolfSpy" },
  { src: "/images/as-seen-on-golfweek-logo-big.avif", alt: "Golfweek" },
  { src: "/images/as-seen-on-golf-monthly-cover-big.avif", alt: "Golf Monthly" },
] as const;

export function PressSection() {
  const t = useTranslations("pressSection");

  return (
    <section className="border-t border-border bg-card">
      <div className="container-page py-12 lg:py-16">
        <p className="eyebrow text-center mb-2">{t("title")}</p>
        <p className="text-center text-xs text-muted-foreground mb-10">
          {t("attribution")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8 items-center">
          {PRESS.map((item) => (
            <div
              key={item.alt}
              className="relative h-10 sm:h-12 grayscale opacity-70 hover:opacity-100 transition"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 14vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
