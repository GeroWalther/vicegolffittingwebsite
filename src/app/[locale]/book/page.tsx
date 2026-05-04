import { setRequestLocale, getTranslations } from "next-intl/server";
import { BookingForm } from "@/components/booking-form";

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book");
  return (
    <section className="container-page pt-20 lg:pt-28 pb-32">
      <p className="eyebrow mb-4">/book</p>
      <h1 className="display text-5xl sm:text-6xl">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
        {t("subtitle")}
      </p>
      <div className="mt-12">
        <BookingForm />
      </div>
    </section>
  );
}
