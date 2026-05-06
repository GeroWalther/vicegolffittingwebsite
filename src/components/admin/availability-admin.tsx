"use client";

import { useMemo, useState, useTransition } from "react";
import { Trash2, Loader2, Save, X, CalendarDays, Lock } from "lucide-react";
import { format as formatDate, parseISO } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AvailabilityDay = {
  id: string;
  date: string; // YYYY-MM-DD
  slots: string[];
  taken: string[]; // HH:MM list of slots already booked
};

type Booking = { time: string; name: string };

type Props = {
  initial: AvailabilityDay[];
  bookingsByDate: Record<string, Booking[]>;
  presetSlots: string[];
};

export function AvailabilityAdmin({
  initial,
  bookingsByDate,
  presetSlots,
}: Props) {
  const [items, setItems] = useState<AvailabilityDay[]>(initial);
  const [editingDates, setEditingDates] = useState<string[]>([]);
  const [editingSlots, setEditingSlots] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  const itemsByDate = useMemo(() => {
    const map = new Map<string, AvailabilityDay>();
    items.forEach((it) => map.set(it.date, it));
    return map;
  }, [items]);

  // Union of all taken slot times across the currently-selected dates.
  // Used to lock those buttons in the editor so admin doesn't accidentally
  // try to remove a slot with an active booking.
  const lockedTimesInEdit = useMemo(() => {
    const set = new Set<string>();
    for (const date of editingDates) {
      (bookingsByDate[date] ?? []).forEach((b) => set.add(b.time));
    }
    return set;
  }, [editingDates, bookingsByDate]);

  function startEditDates(dates: string[]) {
    const sorted = [...new Set(dates)].sort();
    const wasEmpty = editingDates.length === 0;
    setEditingDates(sorted);
    if (wasEmpty && sorted.length > 0) {
      const first = itemsByDate.get(sorted[0]);
      setEditingSlots(first ? [...first.slots] : [...presetSlots]);
    } else if (sorted.length === 0) {
      setEditingSlots([]);
    }
  }

  function startEditSingle(date: string) {
    const existing = itemsByDate.get(date);
    setEditingDates([date]);
    setEditingSlots(existing ? [...existing.slots] : [...presetSlots]);
  }

  function cancelEdit() {
    setEditingDates([]);
    setEditingSlots([]);
  }

  function toggleSlot(time: string) {
    if (lockedTimesInEdit.has(time)) {
      toast.error(`${time} is already booked — cancel the booking first.`);
      return;
    }
    setEditingSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time].sort(),
    );
  }

  function selectAllSlots() {
    setEditingSlots([...presetSlots]);
  }

  function clearAllSlots() {
    // Keep locked (booked) slots in the selection — they can't be removed.
    setEditingSlots([...lockedTimesInEdit].sort());
  }

  function save() {
    if (editingDates.length === 0) return;
    startTransition(async () => {
      const results = await Promise.all(
        editingDates.map(async (date) => {
          const r = await fetch("/api/admin/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, slots: editingSlots }),
          });
          if (!r.ok) {
            const err = await r.json().catch(() => ({}));
            return { date, ok: false as const, error: err?.error as string | undefined };
          }
          const saved = (await r.json()) as Omit<AvailabilityDay, "taken">;
          return { date, ok: true as const, saved };
        }),
      );

      const ok = results.filter((r) => r.ok);
      const failed = results.filter((r) => !r.ok);

      if (ok.length > 0) {
        const okDates = new Set(ok.map((r) => r.date));
        setItems((prev) => {
          const others = prev.filter((it) => !okDates.has(it.date));
          const newOnes: AvailabilityDay[] = ok
            .map((r) => r.saved)
            .filter((s): s is Omit<AvailabilityDay, "taken"> => !!s && s.slots.length > 0)
            .map((s) => ({
              ...s,
              taken: (bookingsByDate[s.date] ?? []).map((b) => b.time),
            }));
          return [...others, ...newOnes].sort((a, b) =>
            a.date.localeCompare(b.date),
          );
        });
      }

      if (failed.length === 0) {
        const slotCount = editingSlots.length;
        toast.success(
          slotCount === 0
            ? `Cleared ${ok.length} day${ok.length === 1 ? "" : "s"}`
            : `Saved ${ok.length} day${ok.length === 1 ? "" : "s"} · ${slotCount} slot${slotCount === 1 ? "" : "s"} each`,
        );
        cancelEdit();
      } else if (ok.length === 0) {
        toast.error(failed[0].error || "Failed to save");
      } else {
        toast.error(
          `Saved ${ok.length}, failed ${failed.length}: ${failed[0].error || "unknown"}`,
        );
      }
    });
  }

  function remove(date: string) {
    if (!confirm(`Remove all slots for ${date}?`)) return;
    startTransition(async () => {
      const res = await fetch(
        `/api/admin/availability?date=${encodeURIComponent(date)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j?.error || "Failed to remove");
        return;
      }
      setItems((prev) => prev.filter((it) => it.date !== date));
      toast.success("Removed");
    });
  }

  const headerLabel = (() => {
    if (editingDates.length === 0) return null;
    if (editingDates.length === 1) {
      const d = editingDates[0];
      const isExisting = itemsByDate.has(d);
      return {
        eyebrow: isExisting ? "Editing" : "New day",
        title: formatDate(parseISO(d), "EEE d MMM yyyy"),
        sub: null as string | null,
      };
    }
    return {
      eyebrow: `${editingDates.length} days selected`,
      title: "Bulk edit",
      sub: editingDates
        .map((d) => formatDate(parseISO(d), "d MMM"))
        .join(" · "),
    };
  })();

  // For single-day edit mode, show the booking names alongside time
  // so admin can quickly see who has the slot.
  const singleDayBookings =
    editingDates.length === 1 ? bookingsByDate[editingDates[0]] ?? [] : [];

  return (
    <div className="grid gap-10 lg:grid-cols-[auto_1fr]">
      <div>
        <h2 className="eyebrow mb-3">Pick one or more dates</h2>
        <div className="rounded-md border border-border bg-card p-3 inline-block">
          <Calendar
            mode="multiple"
            selected={editingDates.map((d) => parseISO(d))}
            onSelect={(dates) => {
              startEditDates(
                (dates ?? []).map((d) => formatDate(d, "yyyy-MM-dd")),
              );
            }}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            modifiers={{
              open: (d) => itemsByDate.has(formatDate(d, "yyyy-MM-dd")),
              hasBooking: (d) =>
                (bookingsByDate[formatDate(d, "yyyy-MM-dd")] ?? []).length > 0,
            }}
            modifiersClassNames={{
              open: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-volt",
              hasBooking:
                "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-foreground",
            }}
            showOutsideDays
          />
        </div>
        <div className="mt-3 space-y-1.5">
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-volt inline-block" />
            Days you&apos;ve opened
          </p>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-foreground inline-block" />
            Day with booking
          </p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground max-w-[260px]">
          Click multiple days to apply the same slots to all at once. Click
          again to deselect.
        </p>
      </div>

      <div className="space-y-8">
        {headerLabel ? (
          <div className="rounded-md border border-volt/50 bg-card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <p className="eyebrow mb-1">{headerLabel.eyebrow}</p>
                <h3 className="display text-2xl">{headerLabel.title}</h3>
                {headerLabel.sub && (
                  <p className="mt-2 font-mono text-xs text-muted-foreground tracking-wider break-words">
                    {headerLabel.sub}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <p className="eyebrow">Time slots</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={selectAllSlots}
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border border-border hover:bg-muted"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={clearAllSlots}
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border border-border hover:bg-muted"
                >
                  None
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {presetSlots.map((time) => {
                const on = editingSlots.includes(time);
                const locked = lockedTimesInEdit.has(time);
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleSlot(time)}
                    title={locked ? "Booked — cancel the booking first" : undefined}
                    className={cn(
                      "h-11 rounded-md border font-mono text-sm tracking-wider transition relative",
                      locked
                        ? "border-foreground bg-foreground text-background cursor-not-allowed"
                        : on
                          ? "border-volt bg-volt text-volt-foreground"
                          : "border-border hover:border-volt/60 text-muted-foreground",
                    )}
                  >
                    {locked && (
                      <Lock className="absolute top-1 right-1 size-2.5" />
                    )}
                    {time}
                  </button>
                );
              })}
            </div>

            {singleDayBookings.length > 0 && (
              <div className="mt-4 rounded-md border border-border bg-muted/30 p-3">
                <p className="eyebrow mb-2 text-[10px]">
                  {singleDayBookings.length} booking
                  {singleDayBookings.length === 1 ? "" : "s"} this day
                </p>
                <ul className="space-y-1">
                  {singleDayBookings
                    .slice()
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((b) => (
                      <li
                        key={`${b.time}-${b.name}`}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="font-mono w-12 shrink-0">{b.time}</span>
                        <span className="text-muted-foreground truncate">
                          {b.name}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              {editingSlots.length === 0
                ? `No slots selected — saving will close ${editingDates.length === 1 ? "this day" : "these days"} for bookings.`
                : `${editingSlots.length} slot${editingSlots.length === 1 ? "" : "s"} selected${editingDates.length > 1 ? ` · applied to all ${editingDates.length} days` : ""}.`}
            </p>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={save}
                disabled={pending}
                className="uppercase tracking-wider"
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
            <CalendarDays className="size-6 opacity-50" />
            Pick one or more dates in the calendar to open them for bookings.
          </div>
        )}

        <div>
          <h2 className="eyebrow mb-3">Upcoming open days</h2>
          {items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No days opened yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((it) => {
                const free = it.slots.filter((s) => !it.taken.includes(s));
                return (
                  <li
                    key={it.id}
                    className="flex items-start justify-between gap-4 rounded-md border border-border bg-card p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <p className="font-semibold">
                          {formatDate(parseISO(it.date), "EEE d MMM yyyy")}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {free.length}/{it.slots.length} free
                        </p>
                      </div>
                      {it.slots.length === 0 ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          (closed)
                        </p>
                      ) : (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {it.slots.map((time) => {
                            const taken = it.taken.includes(time);
                            return (
                              <span
                                key={time}
                                className={cn(
                                  "font-mono text-[11px] tracking-wider px-2 py-0.5 rounded border",
                                  taken
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-volt/60 bg-volt/10 text-foreground",
                                )}
                              >
                                {time}
                                {taken && " ·"}
                                {taken && (
                                  <span className="ml-1 opacity-80">booked</span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditSingle(it.date)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => remove(it.date)}
                        disabled={pending}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
