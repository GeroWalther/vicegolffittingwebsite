"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations, useFormatter, useLocale } from "next-intl";
import { format as formatDate } from "date-fns";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS } from "@/lib/constants";
import { buildSlotsForDate, isPastSlot, isSunday } from "@/lib/slots";
import { cn } from "@/lib/utils";

type Availability = { taken: string[] };

export function BookingForm() {
  const t = useTranslations("book");
  const tCommon = useTranslations("common");
  const fmt = useFormatter();
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const [taken, setTaken] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [handicap, setHandicap] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!date) return;
    const day = formatDate(date, "yyyy-MM-dd");
    setTaken([]);
    setSlot(null);
    fetch(`/api/availability?day=${day}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((j: Availability) => setTaken(j.taken ?? []))
      .catch(() => setTaken([]));
  }, [date]);

  const slots = useMemo(() => (date ? buildSlotsForDate(date) : []), [date]);

  const slotsView = slots.map((s) => ({
    ...s,
    disabled: isPastSlot(s.iso) || taken.includes(s.iso),
  }));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slot || !date || !name || !email) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startsAt: slot,
            name,
            email,
            phone,
            handicap,
            notes,
            locale,
          }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          if (j?.code === "SLOT_TAKEN") {
            toast.error(t("errors.slotTaken"));
            // refresh slots
            const day = formatDate(date, "yyyy-MM-dd");
            const r2 = await fetch(`/api/availability?day=${day}`, { cache: "no-store" });
            if (r2.ok) setTaken(((await r2.json()) as Availability).taken ?? []);
            setSlot(null);
            return;
          }
          throw new Error("checkout failed");
        }
        const { url } = (await res.json()) as { url: string };
        window.location.href = url;
      } catch {
        toast.error(t("errors.generic"));
      }
    });
  }

  const valid = !!slot && !!name.trim() && /^.+@.+\..+$/.test(email);

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <div className="space-y-10">
        <section>
          <Label className="eyebrow mb-3 block">{t("fields.date")}</Label>
          <div className="rounded-md border border-border bg-card p-3 inline-block">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) =>
                d < new Date(new Date().setHours(0, 0, 0, 0)) || isSunday(d)
              }
              showOutsideDays
            />
          </div>
        </section>

        <section>
          <Label className="eyebrow mb-3 block">{t("fields.time")}</Label>
          {!date ? (
            <p className="text-sm text-muted-foreground">{t("selectDate")}</p>
          ) : slotsView.every((s) => s.disabled) ? (
            <p className="text-sm text-muted-foreground">{t("noSlots")}</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {slotsView.map((s) => (
                <button
                  key={s.iso}
                  type="button"
                  disabled={s.disabled}
                  onClick={() => setSlot(s.iso)}
                  className={cn(
                    "h-11 rounded-md border font-mono text-sm tracking-wider transition",
                    s.disabled && "opacity-30 line-through cursor-not-allowed",
                    !s.disabled && slot === s.iso
                      ? "border-volt bg-volt text-volt-foreground"
                      : "border-border hover:border-volt/60",
                  )}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name" className="eyebrow">{t("fields.name")}</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="eyebrow">{t("fields.email")}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="eyebrow">{t("fields.phone")}</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="handicap" className="eyebrow">{t("fields.handicap")}</Label>
            <Input
              id="handicap"
              maxLength={16}
              placeholder={t("fields.handicapPlaceholder")}
              value={handicap}
              onChange={(e) => setHandicap(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes" className="eyebrow">{t("fields.notes")}</Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder={t("fields.notesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-md border border-border bg-card p-6">
          <p className="eyebrow mb-3">{t("summary")}</p>
          <p className="text-sm">{t("session")}</p>
          <div className="mt-4 border-t border-border pt-4 space-y-2 text-sm">
            <Row label={t("fields.date")} value={date ? fmt.dateTime(date, { day: "numeric", month: "long", year: "numeric" }) : "—"} />
            <Row
              label={t("fields.time")}
              value={
                slot
                  ? fmt.dateTime(new Date(slot), { hour: "2-digit", minute: "2-digit" })
                  : "—"
              }
            />
          </div>
          <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
            <span className="eyebrow">{t("total")}</span>
            <span className="display text-3xl">€{BUSINESS.fittingPriceEUR}</span>
          </div>
          <p className="mt-3 rounded-md bg-volt/15 border border-volt/40 px-3 py-2 text-xs leading-relaxed text-foreground">
            {t("creditNote")}
          </p>
          <Button type="submit" size="lg" disabled={!valid || pending} className="mt-6 w-full h-12 uppercase tracking-wider">
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> {t("submitting")}
              </>
            ) : (
              <>
                {t("submit")} <ArrowRight className="ml-1 size-4" />
              </>
            )}
          </Button>
          <p className="mt-3 text-[10px] text-muted-foreground text-center font-mono uppercase tracking-wider">
            {tCommon("loading").replace(/…/, "")} · Stripe · 256-bit
          </p>
        </div>
      </aside>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
