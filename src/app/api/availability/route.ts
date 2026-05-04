import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/lib/models/booking";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const day = searchParams.get("day");
  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return NextResponse.json({ error: "bad day" }, { status: 400 });
  }
  const start = new Date(`${day}T00:00:00.000Z`);
  const end = new Date(`${day}T23:59:59.999Z`);

  try {
    await connectDB();
    const taken = await Booking.find({
      status: { $in: ["pending", "paid"] },
      startsAt: { $gte: start, $lte: end },
    })
      .select("startsAt")
      .lean();
    return NextResponse.json({
      taken: taken.map((t) => t.startsAt.toISOString()),
    });
  } catch (e) {
    console.error("[availability]", e);
    return NextResponse.json({ taken: [] });
  }
}
