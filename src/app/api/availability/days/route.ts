import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Availability } from "@/lib/models/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (
    !from ||
    !to ||
    !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(to)
  ) {
    return NextResponse.json({ days: [] });
  }
  const start = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);
  try {
    await connectDB();
    const items = await Availability.find({
      date: { $gte: start, $lte: end },
      slots: { $not: { $size: 0 } },
    })
      .select("date")
      .lean();
    return NextResponse.json({
      days: items.map((a) => a.date.toISOString().slice(0, 10)),
    });
  } catch (e) {
    console.error("[availability/days]", e);
    return NextResponse.json({ days: [] });
  }
}
