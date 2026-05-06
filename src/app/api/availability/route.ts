import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/lib/models/booking";
import { Availability } from "@/lib/models/availability";
import { dayKeyToUtcMidnight, venueDateAndTime } from "@/lib/availability-utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const day = searchParams.get("day");
  const dayStart = day ? dayKeyToUtcMidnight(day) : null;
  if (!day || !dayStart) {
    return NextResponse.json({ error: "bad day" }, { status: 400 });
  }

  try {
    await connectDB();

    const availabilityDoc = await Availability.findOne({ date: dayStart }).lean();

    // Match every booking whose Madrid-local calendar date equals `day`.
    // We over-fetch a 48-hour window around the UTC day to cover DST drift,
    // then filter precisely on the venue-local date string.
    const windowStart = new Date(dayStart.getTime() - 24 * 60 * 60_000);
    const windowEnd = new Date(dayStart.getTime() + 48 * 60 * 60_000);
    const candidates = await Booking.find({
      status: { $in: ["pending", "paid"] },
      startsAt: { $gte: windowStart, $lt: windowEnd },
    })
      .select("startsAt")
      .lean();
    const taken = candidates
      .filter((b) => venueDateAndTime(b.startsAt).date === day)
      .map((b) => b.startsAt.toISOString());

    return NextResponse.json({
      slots: availabilityDoc?.slots ?? [],
      taken,
    });
  } catch (e) {
    console.error("[availability]", e);
    return NextResponse.json({ slots: [], taken: [] });
  }
}
