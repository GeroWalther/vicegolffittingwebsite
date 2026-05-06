import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Availability } from "@/lib/models/availability";
import { Booking } from "@/lib/models/booking";
import { isAdmin } from "@/lib/auth";
import { dayKeyToUtcMidnight, venueDateAndTime } from "@/lib/availability-utils";

const Body = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slots: z
    .array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/))
    .max(24),
});

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauth" }, { status: 401 });
  }
  try {
    await connectDB();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const items = await Availability.find({ date: { $gte: today } })
      .sort({ date: 1 })
      .limit(180)
      .lean();
    return NextResponse.json({
      items: items.map((a) => ({
        id: String(a._id),
        date: a.date.toISOString().slice(0, 10),
        slots: a.slots,
      })),
    });
  } catch (e) {
    console.error("[admin/availability GET]", e);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauth" }, { status: 401 });
  }
  let body;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    const issues =
      e instanceof z.ZodError ? e.issues.map((i) => i.message) : undefined;
    return NextResponse.json({ error: "bad body", issues }, { status: 400 });
  }
  const date = dayKeyToUtcMidnight(body.date);
  if (!date) {
    return NextResponse.json({ error: "bad date" }, { status: 400 });
  }

  // De-dupe + sort slots so storage is predictable.
  const slots = [...new Set(body.slots)].sort();

  try {
    await connectDB();

    // Refuse to drop a slot that has an active booking — admin must cancel
    // the booking explicitly first.
    if (slots.length > 0) {
      const active = await Booking.find({
        status: { $in: ["pending", "paid"] },
      })
        .select("startsAt")
        .lean();
      const occupied = active
        .map((b) => venueDateAndTime(b.startsAt))
        .filter((p) => p.date === body.date)
        .map((p) => p.time);
      const missing = occupied.filter((t) => !slots.includes(t));
      if (missing.length > 0) {
        return NextResponse.json(
          {
            error: `Cannot remove slots with active bookings: ${missing.join(", ")}`,
          },
          { status: 409 },
        );
      }
    }

    const updated = await Availability.findOneAndUpdate(
      { date },
      { $set: { date, slots } },
      { upsert: true, new: true, runValidators: true },
    ).lean();
    return NextResponse.json({
      id: String(updated!._id),
      date: updated!.date.toISOString().slice(0, 10),
      slots: updated!.slots,
    });
  } catch (e) {
    console.error("[admin/availability POST]", e);
    return NextResponse.json(
      { error: "server error", message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauth" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const dayStr = searchParams.get("date");
  if (!dayStr) {
    return NextResponse.json({ error: "missing date" }, { status: 400 });
  }
  const date = dayKeyToUtcMidnight(dayStr);
  if (!date) {
    return NextResponse.json({ error: "bad date" }, { status: 400 });
  }

  try {
    await connectDB();
    const active = await Booking.find({
      status: { $in: ["pending", "paid"] },
    })
      .select("startsAt")
      .lean();
    const occupied = active
      .map((b) => venueDateAndTime(b.startsAt))
      .filter((p) => p.date === dayStr);
    if (occupied.length > 0) {
      return NextResponse.json(
        {
          error:
            "Day has active bookings. Cancel them first before removing the day.",
        },
        { status: 409 },
      );
    }
    await Availability.deleteOne({ date });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/availability DELETE]", e);
    return NextResponse.json(
      { error: "server error", message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
