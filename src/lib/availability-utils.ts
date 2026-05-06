import { FITTING_TIMEZONE } from "./constants";

const partsCache = new Intl.DateTimeFormat("en-GB", {
  timeZone: FITTING_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// Convert a Date into the Madrid-local calendar date (YYYY-MM-DD) and
// HH:MM string. Used so DB lookups and slot validation don't drift across
// daylight-saving boundaries.
export function venueDateAndTime(d: Date): { date: string; time: string } {
  const parts = partsCache.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

export function dayKeyToUtcMidnight(day: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const d = new Date(`${day}T00:00:00.000Z`);
  return isNaN(d.getTime()) ? null : d;
}
