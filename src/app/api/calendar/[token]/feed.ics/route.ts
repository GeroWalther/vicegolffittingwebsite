import { createEvents, type EventAttributes } from "ics";
import { connectDB } from "@/lib/db";
import { Booking } from "@/lib/models/booking";
import { DemoDayRsvp } from "@/lib/models/demoday-rsvp";
import { DemoDay } from "@/lib/models/demoday";
import { BUSINESS } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function toArr(d: Date): [number, number, number, number, number] {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ];
}

// A private subscription feed: every paid booking and confirmed demo-day RSVP
// appears in your calendar app within minutes of being created. Auth is by
// random token in the URL — anyone with the link can read, so treat it like a
// password and rotate via env var if it leaks.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const expected = process.env.CALENDAR_FEED_TOKEN;
  if (!expected || token !== expected) {
    return new Response("Not found", { status: 404 });
  }

  try {
    await connectDB();

    // 60 days back so cancelled customers stay visible briefly; 365 days ahead.
    const lookback = new Date(Date.now() - 60 * 24 * 60 * 60_000);
    const lookahead = new Date(Date.now() + 365 * 24 * 60 * 60_000);

    const [bookings, rsvps] = await Promise.all([
      Booking.find({
        status: "paid",
        startsAt: { $gte: lookback, $lte: lookahead },
      })
        .sort({ startsAt: 1 })
        .lean(),
      DemoDayRsvp.find({
        status: "confirmed",
        slotStartsAt: { $gte: lookback, $lte: lookahead },
      })
        .sort({ slotStartsAt: 1 })
        .lean(),
    ]);

    const demoIds = [...new Set(rsvps.map((r) => String(r.demoDayId)))];
    const demoDays = demoIds.length
      ? await DemoDay.find({ _id: { $in: demoIds } }).lean()
      : [];
    const demoMap = new Map(demoDays.map((d) => [String(d._id), d]));

    const events: EventAttributes[] = [];

    for (const b of bookings) {
      const desc = [
        `${b.email}${b.phone ? ` · ${b.phone}` : ""}`,
        b.handicap ? `HCP ${b.handicap}` : "",
        b.notes ? `Notes: ${b.notes}` : "",
        `Amount: €${(b.amountCents / 100).toFixed(2)}`,
      ]
        .filter(Boolean)
        .join("\n");

      events.push({
        start: toArr(b.startsAt),
        startInputType: "utc",
        end: toArr(b.endsAt),
        endInputType: "utc",
        title: `Vice Fitting · ${b.name}`,
        description: desc,
        location: BUSINESS.location,
        uid: `booking-${b._id}@vicefitting`,
        status: "CONFIRMED",
        busyStatus: "BUSY",
        productId: "vicefitting/feed",
        organizer: { name: BUSINESS.fitter, email: BUSINESS.email },
      });
    }

    for (const r of rsvps) {
      const d = demoMap.get(String(r.demoDayId));
      const desc = [
        `${r.email}${r.phone ? ` · ${r.phone}` : ""}`,
        r.handicap ? `HCP ${r.handicap}` : "",
        d ? `Venue: ${d.venue}${d.address ? `, ${d.address}` : ""}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      events.push({
        start: toArr(r.slotStartsAt),
        startInputType: "utc",
        end: toArr(r.slotEndsAt),
        endInputType: "utc",
        title: `Demo · ${r.name}${d ? ` · ${d.title}` : ""}`,
        description: desc,
        location: d ? (d.address ? `${d.venue}, ${d.address}` : d.venue) : "",
        uid: `rsvp-${r._id}@vicefitting`,
        status: "CONFIRMED",
        busyStatus: "BUSY",
        productId: "vicefitting/feed",
        organizer: { name: BUSINESS.fitter, email: BUSINESS.email },
      });
    }

    const { error, value } = createEvents(events, {
      calName: "Vice Fitting · Bookings",
      productId: "-//Vice Fitting//Bookings Feed//EN",
    });

    if (error || !value) {
      console.error("[calendar/feed] createEvents error:", error);
      return new Response("Failed to build feed", { status: 500 });
    }

    return new Response(value, {
      headers: {
        "content-type": "text/calendar; charset=utf-8",
        // Calendar clients respect this; 5 min keeps load low while still
        // surfacing new bookings quickly enough for live use.
        "cache-control": "public, max-age=300",
      },
    });
  } catch (e) {
    console.error("[calendar/feed]", e);
    return new Response("Server error", { status: 500 });
  }
}
