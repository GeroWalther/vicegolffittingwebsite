import { DAILY_SLOTS, BUSINESS } from "./constants";

export type Slot = { time: string; iso: string };

export function buildSlotsForDate(date: Date): Slot[] {
  return DAILY_SLOTS.map((time) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return { time, iso: d.toISOString() };
  });
}

export function slotEnd(startsAt: Date): Date {
  return new Date(startsAt.getTime() + BUSINESS.fittingDurationMinutes * 60_000);
}

export function isPastSlot(slotIso: string): boolean {
  return new Date(slotIso).getTime() < Date.now() + 60 * 60_000;
}

export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

// Generate evenly-spaced slots between a demo day's start and end.
// Last slot starts at end - slotMinutes (so it ends exactly at `end`).
export function buildDemoDaySlots(
  startsAt: Date,
  endsAt: Date,
  slotMinutes: number,
): Slot[] {
  const slots: Slot[] = [];
  const stepMs = slotMinutes * 60_000;
  for (
    let t = startsAt.getTime();
    t + stepMs <= endsAt.getTime();
    t += stepMs
  ) {
    const d = new Date(t);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    slots.push({ time: `${hh}:${mm}`, iso: d.toISOString() });
  }
  return slots;
}
