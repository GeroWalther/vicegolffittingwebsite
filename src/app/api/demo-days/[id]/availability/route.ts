import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DemoDay } from "@/lib/models/demoday";
import { DemoDayRsvp } from "@/lib/models/demoday-rsvp";
import { buildDemoDaySlots } from "@/lib/slots";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectDB();
    const demo = await DemoDay.findById(id).lean();
    if (!demo || !demo.published) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const slots = buildDemoDaySlots(
      demo.startsAt,
      demo.endsAt,
      demo.slotMinutes ?? 30,
    );

    const taken = await DemoDayRsvp.find({
      demoDayId: demo._id,
      status: "confirmed",
    })
      .select("slotStartsAt")
      .lean();

    const takenSet = new Set(taken.map((t) => t.slotStartsAt.toISOString()));

    return NextResponse.json({
      demoDay: {
        id: String(demo._id),
        title: demo.title,
        venue: demo.venue,
        address: demo.address ?? "",
        description: demo.description ?? "",
        startsAt: demo.startsAt.toISOString(),
        endsAt: demo.endsAt.toISOString(),
        slotMinutes: demo.slotMinutes ?? 30,
      },
      slots: slots.map((s) => ({
        ...s,
        taken: takenSet.has(s.iso),
      })),
    });
  } catch (e) {
    console.error("[demo-day availability]", e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
