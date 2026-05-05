"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Slot = { time: string; iso: string; taken: boolean };
type Availability = {
  demoDay: {
    id: string;
    title: string;
    venue: string;
    address: string;
    startsAt: string;
    endsAt: string;
    slotMinutes: number;
  };
  slots: Slot[];
};

export function DemoDayRsvpDialog({
  open,
  onOpenChange,
  demoDayId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  demoDayId: string | null;
}) {
  const t = useTranslations("rsvp");
  const locale = useLocale();
  const [data, setData] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [handicap, setHandicap] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open || !demoDayId) return;
    setData(null);
    setSlot(null);
    setName("");
    setEmail("");
    setPhone("");
    setHandicap("");
    setDone(false);
    setLoading(true);
    fetch(`/api/demo-days/${demoDayId}/availability`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((j: Availability) => setData(j))
      .catch(() => toast.error(t("loadError")))
      .finally(() => setLoading(false));
  }, [open, demoDayId, t]);

  function refresh() {
    if (!demoDayId) return;
    fetch(`/api/demo-days/${demoDayId}/availability`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((j: Availability) => setData(j))
      .catch(() => {});
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!demoDayId || !slot || !name.trim() || !/^.+@.+\..+$/.test(email)) return;

    startTransition(async () => {
      const res = await fetch(`/api/demo-days/${demoDayId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          handicap,
          slotIso: slot,
          locale,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        if (j?.code === "SLOT_TAKEN") {
          toast.error(t("slotTaken"));
          refresh();
          setSlot(null);
          return;
        }
        toast.error(t("genericError"));
        return;
      }
      setDone(true);
    });
  }

  const dateFmt = data
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(data.demoDay.startsAt))
    : "";
  const timeFmt = (iso: string) =>
    new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  const valid = !!slot && !!name.trim() && /^.+@.+\..+$/.test(email);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        {done ? (
          <div className="py-8 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-volt text-volt-foreground">
              <CheckCircle2 className="size-7" />
            </span>
            <DialogTitle className="display text-3xl mt-6">
              {t("doneTitle")}
            </DialogTitle>
            <DialogDescription className="mt-3 text-base text-muted-foreground">
              {t("doneBody")}
            </DialogDescription>
            <Button
              type="button"
              size="lg"
              onClick={() => onOpenChange(false)}
              className="mt-8 uppercase tracking-wider"
            >
              {t("close")}
            </Button>
          </div>
        ) : loading || !data ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <DialogHeader>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("eyebrow")}
              </p>
              <DialogTitle className="display text-2xl sm:text-3xl">
                {data.demoDay.title}
              </DialogTitle>
              <DialogDescription className="text-sm flex items-center gap-1.5 pt-1">
                <MapPin className="size-3.5" /> {data.demoDay.venue}
                {data.demoDay.address ? ` · ${data.demoDay.address}` : ""}
              </DialogDescription>
              <p className="font-mono text-xs text-muted-foreground pt-1">
                {dateFmt} · {timeFmt(data.demoDay.startsAt)} —{" "}
                {timeFmt(data.demoDay.endsAt)} · {data.demoDay.slotMinutes}{" "}
                {t("minSlots")}
              </p>
            </DialogHeader>

            <div>
              <Label className="eyebrow mb-3 block">{t("pickSlot")}</Label>
              {data.slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noSlots")}</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {data.slots.map((s) => {
                    const past = new Date(s.iso).getTime() < Date.now();
                    const disabled = s.taken || past;
                    return (
                      <button
                        key={s.iso}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSlot(s.iso)}
                        className={cn(
                          "h-10 rounded-md border font-mono text-sm tracking-wider transition",
                          disabled &&
                            "opacity-30 line-through cursor-not-allowed",
                          !disabled && slot === s.iso
                            ? "border-volt bg-volt text-volt-foreground"
                            : "border-border hover:border-foreground/40",
                        )}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {slot && (
              <div className="space-y-3 border-t border-border pt-5">
                <div className="space-y-2">
                  <Label htmlFor="rsvp-name" className="eyebrow">
                    {t("name")}
                  </Label>
                  <Input
                    id="rsvp-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="rsvp-email" className="eyebrow">
                      {t("email")}
                    </Label>
                    <Input
                      id="rsvp-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rsvp-phone" className="eyebrow">
                      {t("phone")}
                    </Label>
                    <Input
                      id="rsvp-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rsvp-handicap" className="eyebrow">
                    {t("handicap")}
                  </Label>
                  <Input
                    id="rsvp-handicap"
                    maxLength={16}
                    placeholder={t("handicapPlaceholder")}
                    value={handicap}
                    onChange={(e) => setHandicap(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={!valid || pending}
              className="w-full h-11 uppercase tracking-wider"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />{" "}
                  {t("submitting")}
                </>
              ) : (
                <>
                  {t("submit")} <ArrowRight className="ml-1 size-4" />
                </>
              )}
            </Button>
            <p className="text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {t("freeNote")}
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
